import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import util from 'util';
import xml2js from 'xml2js';
import request from 'request'

/*
  Generated class for the EventsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventsProvider {
  events: any;

  constructor(public http: HttpClient) {
    console.log('Hello EventsProvider Provider');
    this.events = null;
  }

  getEvent(id){
    return this.events[id]
  }

  load(url) {
    return new Promise((resolve,reject) => {
      if(this.events){
        resolve(this.events)
      }
      else {
        var $ = this;
        request({
          url: url,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:45.0) Gecko/20100101 Firefox/45.0',
            accept: 'text/html,application/xhtml+xml'
          },
          pool: false,
          followRedirect: true

        }, (error, response, xml) => {
          if (!error && response.statusCode == 200) {
            var parser = new xml2js.Parser({ trim: false, normalize: true, mergeAttrs: true });
            parser.addListener("error",(err) => {
              reject(err);
            });
            parser.parseString(xml, (err, result) => {
              var res = $.parser(result)
              this.events = res;
              resolve(res);
              //console.log(JSON.stringify(result.rss.channel));
            });

          } //else {
            //this.emit('error', new Error('Bad status code'));
          //}
        });
      }
    });
  }

  private formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();


    var time = new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();

    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + this.pad(hours) + ':' + this.pad(minutes);
  }

  private pad(n) {
    return (n < 10) ? '0' + n : n;
  }

  private parser(json) {
    var channel = json.rss.channel;
    var rss : any = { items: []};

    if (util.isArray(json.rss.channel))
      channel = json.rss.channel[0];

    if (channel.title) {
      rss.title = channel.title[0];
    }
    if (channel.description) {
      rss.description = channel.description[0];
    }
    if (channel.link) {
      rss.url = channel.link[0];
    }

    // add rss.image via @dubyajaysmith
    if (channel.image) {
      rss.image = channel.image[0].url
    }

    if (!rss.image && channel["itunes:image"]) {
      rss.image = channel['itunes:image'][0].href
    }

    rss.image = rss.image && Array.isArray(rss.image) ? rss.image[0] : '';

    if (channel.item) {
      if (!util.isArray(channel.item)) {
        channel.item = [channel.item];
      }
      channel.item.forEach((val) => {
        var obj = val;

        obj.title = !util.isNullOrUndefined(val.title) ? val.title[0] : '';
        obj.description = !util.isNullOrUndefined(val.description) ? val.description[0] : '';
        obj.url = obj.link = !util.isNullOrUndefined(val.link) ? val.link[0] : '';

        if (val.pubDate) {
          //lets try basis js date parsing for now
          obj.created = Date.parse(val.pubDate[0]);
        }
        if (val['media:content']) {
          obj.media = val.media || {};
          obj.media.content = val['media:content'];
        }
        if (val['media:thumbnail']) {
          obj.media = val.media || {};
          obj.media.thumbnail = val['media:thumbnail'];
        }

        if(val['event:startdate']){
          obj['event:startdate'] = this.formatDate(new Date(val['event:startdate']))
        }

        if(val['event:enddate']){
          obj['event:enddate'] = this.formatDate(new Date(val['event:enddate']))
        }


        if (val.enclosure) {
          obj.enclosures = [];
          if (!util.isArray(val.enclosure))
            val.enclosure = [val.enclosure];
          val.enclosure.forEach(function (enclosure) {
            var enc = {};
            for (var x in enclosure) {
              enc[x] = enclosure[x][0];
            }
            obj.enclosures.push(enc);
          });

        }
        obj.id = rss.items.length
        rss.items.push(obj);

      });

    }
    return rss;

  }

  private read(url, callback) {
    return this.load(url);
  }

}
