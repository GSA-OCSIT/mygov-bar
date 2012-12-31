// Generated by CoffeeScript 1.4.0
(function() {
  var CrossDomain, XD, router,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  MyGovBar.Models.Page = (function(_super) {

    __extends(Page, _super);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.paramRoot = 'page';

    Page.prototype.urlRoot = MyGovBar.config.api_url + "/pages";

    Page.prototype.url = function() {
      var url;
      url = this.urlRoot;
      if (this.id != null) {
        url += "/" + this.id;
      }
      url += ".json";
      return url;
    };

    Page.prototype.lookup = function() {
      var old_url,
        _this = this;
      old_url = this.url;
      this.url = this.urlRoot + ".json?url=" + this.get("url") + "&callback=?";
      this.fetch({
        error: function(page, err) {
          if (err.status !== 404) {
            return;
          }
          return _this.save();
        }
      });
      this.url = old_url;
      return this.trigger('change');
    };

    Page.prototype.initialize = function() {
      return this.lookup();
    };

    Page.prototype.defaults = {
      url: document.referrer
    };

    Page.prototype.parse = function(data) {
      var tags;
      if (data == null) {
        return;
      }
      tags = new MyGovBar.Collections.Tags;
      _.each(data.tags, function(tag) {
        return tags.add(new MyGovBar.Models.Tag(tag), {
          silent: true
        });
      });
      data.tags = tags;
      return data;
    };

    return Page;

  })(Backbone.Model);

  MyGovBar.Collections.PagesCollection = (function(_super) {

    __extends(PagesCollection, _super);

    function PagesCollection() {
      return PagesCollection.__super__.constructor.apply(this, arguments);
    }

    PagesCollection.prototype.model = MyGovBar.Models.Page;

    PagesCollection.prototype.url = '/pages';

    return PagesCollection;

  })(Backbone.Collection);

  MyGovBar.Models.Comment = (function(_super) {

    __extends(Comment, _super);

    function Comment() {
      return Comment.__super__.constructor.apply(this, arguments);
    }

    Comment.prototype.url = function() {
      return MyGovBar.config.api_url + "/pages/" + this.get('page_id') + "/comments.json";
    };

    Comment.prototype.defaults = function() {
      return {
        page_id: MyGovBar.page.get('id'),
        body: ""
      };
    };

    return Comment;

  })(Backbone.Model);

  MyGovBar.Collections.Comments = (function(_super) {

    __extends(Comments, _super);

    function Comments() {
      return Comments.__super__.constructor.apply(this, arguments);
    }

    Comments.prototype.model = MyGovBar.Models.Comment;

    return Comments;

  })(Backbone.Collection);

  MyGovBar.Models.Tag = (function(_super) {

    __extends(Tag, _super);

    function Tag() {
      return Tag.__super__.constructor.apply(this, arguments);
    }

    Tag.prototype.url = function() {
      return MyGovBar.config.api_url + '/tags' + this.get('name') + '.json';
    };

    Tag.prototype.defaults = {
      name: '',
      id: null
    };

    return Tag;

  })(Backbone.Model);

  MyGovBar.Collections.Tags = (function(_super) {

    __extends(Tags, _super);

    function Tags() {
      return Tags.__super__.constructor.apply(this, arguments);
    }

    Tags.prototype.model = MyGovBar.Models.Tag;

    Tags.prototype.url = MyGovBar.config.api_url + '/tags';

    Tags.prototype.toJSON = function() {
      return this.pluck('name').join(', ');
    };

    Tags.prototype.initialize = function() {
      var _this = this;
      return this.on('add remove', function() {
        return MyGovBar.page.save({
          tag_list: _this.toJSON()
        });
      });
    };

    return Tags;

  })(Backbone.Collection);

  MyGovBar.Views.Mini = (function(_super) {

    __extends(Mini, _super);

    function Mini() {
      return Mini.__super__.constructor.apply(this, arguments);
    }

    Mini.prototype.el = '#bar';

    Mini.prototype.events = {
      "click .expand a": "toggle",
      "click #tabs li.related a": "related"
    };

    Mini.prototype.render = function() {
      var relatedView,
        _this = this;
      this.$el.clearQueue();
      this.$el.addClass('mini');
      this.$el.addClass('shown');
      this.$el.removeClass('expanded');
      this.$el.removeClass('hidden');
      $('.row').css('width', window.innerWidth + 'px');
      setTimeout(function() {
        return _this.$el.animate({
          width: '100%'
        }, 1000, function() {
          return $('.row').css('width', '100%');
        });
      }, 1);
      return relatedView = new MyGovBar.Views.Related({
        model: this.model
      });
    };

    Mini.prototype.toggle = function(e) {
      e.preventDefault();
      MyGovBar.Router.navigate('expanded', true);
      return false;
    };

    Mini.prototype.related = function(e) {
      e.preventDefault();
      MyGovBar.Router.navigate('related', true);
      return false;
    };

    return Mini;

  })(Backbone.View);

  MyGovBar.Views.Related = (function(_super) {

    __extends(Related, _super);

    function Related() {
      this.render = __bind(this.render, this);
      return Related.__super__.constructor.apply(this, arguments);
    }

    Related.prototype.el = "#drawer";

    Related.prototype.template = $("#related_template").html();

    Related.prototype["class"] = "related";

    Related.prototype.render = function() {
      var compiled;
      compiled = _.template(this.template);
      this.$el.html(compiled(this.model.toJSON()));
      return MyGovBar.CrossDomain.sendHeight();
    };

    Related.prototype.initialize = function() {
      return this.model.on('change:related', this.render);
    };

    return Related;

  })(Backbone.View);

  MyGovBar.Views.Feedback = (function(_super) {

    __extends(Feedback, _super);

    function Feedback() {
      this.saveRating = __bind(this.saveRating, this);
      return Feedback.__super__.constructor.apply(this, arguments);
    }

    Feedback.prototype.el = "#drawer";

    Feedback.prototype.template = $('#feedback_template').html();

    Feedback.prototype.render = function() {
      var compiled;
      this.model.off('change');
      compiled = _.template(this.template);
      this.$el.html(compiled());
      return $('input.star').rating({
        callback: this.saveRating
      });
    };

    Feedback.prototype.saveRating = function(value, link) {
      return this.model.save({
        rating: value
      });
    };

    return Feedback;

  })(Backbone.View);

  MyGovBar.Views.Hidden = (function(_super) {

    __extends(Hidden, _super);

    function Hidden() {
      return Hidden.__super__.constructor.apply(this, arguments);
    }

    Hidden.prototype.el = "#bar";

    Hidden.prototype.render = function() {
      var _this = this;
      $('.row').css('width', window.innerWidth + 'px');
      return this.$el.animate({
        width: '0px'
      }, 1000, function() {
        _this.$el.removeClass('shown');
        _this.$el.addClass('hidden');
        _this.$el.removeClass('mini');
        _this.$el.removeClass('expanded');
        _this.$el.clearQueue();
        return $('.row').css('width', '100%');
      });
    };

    return Hidden;

  })(Backbone.View);

  MyGovBar.Views.Search = (function(_super) {

    __extends(Search, _super);

    function Search() {
      this.submit = __bind(this.submit, this);
      return Search.__super__.constructor.apply(this, arguments);
    }

    Search.prototype.el = "#drawer";

    Search.prototype.template = $('#search_template').html();

    Search.prototype.events = {
      "submit #search": "submit"
    };

    Search.prototype.render = function() {
      var compiled;
      compiled = _.template(this.template);
      return this.$el.html(compiled());
    };

    Search.prototype.submit = function(e) {
      e.preventDefault();
      MyGovBar.Router.navigate("search/" + $('#search_query').val(), true);
      return false;
    };

    return Search;

  })(Backbone.View);

  MyGovBar.Views.SearchResult = (function(_super) {

    __extends(SearchResult, _super);

    function SearchResult() {
      return SearchResult.__super__.constructor.apply(this, arguments);
    }

    SearchResult.prototype.el = "#drawer";

    SearchResult.prototype.template = $('#search_result_template').html();

    SearchResult.prototype.render = function() {
      var compiled;
      compiled = _.template(this.template);
      return this.$el.html(compiled({
        query: this.query
      }));
    };

    return SearchResult;

  })(Backbone.View);

  MyGovBar.TagManager = (function() {

    function TagManager() {}

    TagManager.prototype.compareItems = function(a, b) {
      if (a.get('name') === b.get('name')) {
        return true;
      }
      return false;
    };

    TagManager.prototype.init = function(core) {};

    TagManager.prototype.filter = function(list, query) {
      return _.filter(list.models, function(item) {
        return this.itemContains(item, query);
      });
    };

    TagManager.prototype.itemContains = function(item, needle) {
      return item.get('name').indexOf(query) === 0;
    };

    TagManager.prototype.itemToString = function(item) {
      return item.get('name');
    };

    TagManager.prototype.stringToItem = function(string) {
      var tag;
      tag = new MyGovBar.Models.Tag();
      tag.set('name', string);
      return tag;
    };

    return TagManager;

  })();

  MyGovBar.Views.Tags = (function(_super) {

    __extends(Tags, _super);

    function Tags() {
      this.render = __bind(this.render, this);
      return Tags.__super__.constructor.apply(this, arguments);
    }

    Tags.prototype.el = "#drawer";

    Tags.prototype.template = $('#tags_template').html();

    Tags.prototype.render = function() {
      var compiled;
      compiled = _.template(this.template);
      this.$el.html(compiled({
        page: this.model.toJSON(),
        tags: this.model.get('tags').toJSON()
      }));
      $('#tag_list').textext({
        plugins: 'tags autocomplete suggestsions ajax',
        tagsItems: this.model.get('tags').models,
        itemManager: MyGovBar.TagManager,
        ajax: {
          url: MyGovBar.config.api_url + '/tags.json'
        }
      });
      $('#tag_list').unbind('setSuggestions');
      $('#tag_list').on({
        setSuggestions: function(e, data) {
          var tags;
          tags = [];
          _.each(data.result, function(tag) {
            return tags.push(new MyGovBar.Models.Tag(tag));
          });
          data.result = tags;
          return $('#tag_list').textext()[0].autocomplete().onSetSuggestions(e, data);
        }
      });
      return $('#tag_list').on('setFormData', function(e, data) {
        return MyGovBar.page.get('tags').update(data);
      });
    };

    return Tags;

  })(Backbone.View);

  MyGovBar.Views.Expanded = (function(_super) {

    __extends(Expanded, _super);

    function Expanded() {
      return Expanded.__super__.constructor.apply(this, arguments);
    }

    Expanded.prototype.el = "#bar";

    Expanded.prototype.events = {
      "click #tabs li.tags a": "tags",
      "click #tabs li.search a": "search",
      "click #tabs li.feedback a": "feedback"
    };

    Expanded.prototype.render = function() {
      var _this = this;
      this.$el.clearQueue();
      this.$el.css('width', this.$el.css('width'));
      return setTimeout(function() {
        return _this.$el.animate({
          width: '100%'
        }, 1000, function() {
          _this.$el.removeClass('mini');
          _this.$el.addClass('shown');
          _this.$el.addClass('expanded');
          _this.$el.removeClass('hidden');
          return MyGovBar.CrossDomain.sendHeight();
        });
      }, 1);
    };

    Expanded.prototype.tags = function(e) {
      e.preventDefault();
      MyGovBar.Router.navigate('tags', true);
      return false;
    };

    Expanded.prototype.search = function(e) {
      e.preventDefault();
      MyGovBar.Router.navigate('search', true);
      return false;
    };

    Expanded.prototype.feedback = function(e) {
      e.preventDefault();
      MyGovBar.Router.navigate('feedback', true);
      return false;
    };

    return Expanded;

  })(Backbone.View);

  router = (function(_super) {

    __extends(router, _super);

    function router() {
      return router.__super__.constructor.apply(this, arguments);
    }

    router.prototype.routes = {
      "hidden": "hide",
      "expanded": "expand",
      "related": "related",
      "tags": "tags",
      "search": "search",
      "search/:query": "searchResult",
      "feedback": "feedback",
      "mini": "mini",
      "*path": "minify"
    };

    router.prototype.initialize = function() {
      MyGovBar.page = new MyGovBar.Models.Page();
      return Backbone.history.on('route', this.setCurrent);
    };

    router.prototype.mini = function() {
      var miniView;
      MyGovBar.CrossDomain.send('mini');
      miniView = new MyGovBar.Views.Mini({
        model: MyGovBar.page
      });
      return miniView.render();
    };

    router.prototype.minify = function() {
      return this.navigate('mini', true);
    };

    router.prototype.expand = function() {
      var view;
      MyGovBar.CrossDomain.send('expanded');
      view = new MyGovBar.Views.Expanded;
      return view.render();
    };

    router.prototype.hide = function() {
      var view;
      MyGovBar.CrossDomain.send('hidden');
      view = new MyGovBar.Views.Hidden;
      return view.render();
    };

    router.prototype.tags = function() {
      var view;
      view = new MyGovBar.Views.Tags({
        model: MyGovBar.page
      });
      return view.render();
    };

    router.prototype.related = function() {
      var view;
      view = new MyGovBar.Views.Related({
        model: MyGovBar.page
      });
      return view.render();
    };

    router.prototype.search = function() {
      var view;
      view = new MyGovBar.Views.Search;
      return view.render();
    };

    router.prototype.searchResult = function(query) {
      var view;
      view = new MyGovBar.Views.SearchResult;
      view.query = query;
      return view.render();
    };

    router.prototype.feedback = function() {
      var view;
      view = new MyGovBar.Views.Feedback({
        model: MyGovBar.page
      });
      return view.render();
    };

    router.prototype.setCurrent = function() {
      var tab;
      tab = Backbone.history.fragment;
      if (tab.indexOf("search/") !== -1) {
        tab = "search search-result";
      }
      $('#tabs li.current').removeClass('current');
      $('#tabs li.' + tab).addClass('current');
      $('#bar').removeClass(MyGovBar.config.tabs.join(" ") + " search-result");
      return $('#bar').addClass(tab);
    };

    return router;

  })(Backbone.Router);

  MyGovBar.Router = new router();

  XD = {
    interval_id: void 0,
    last_hash: void 0,
    cache_bust: 1,
    attached_callback: void 0,
    window: this,
    postMessage: function(message, target_url, target) {
      if (!target_url) {
        return;
      }
      target = target || parent;
      if (window["postMessage"]) {
        return target["postMessage"](message, target_url.replace(/([^:]+:\/\/[^\/]+).*/, "$1"));
      } else {
        if (target_url) {
          return target.location = target_url.replace(/#.*$/, "") + "#" + (+(new Date)) + (cache_bust++) + "&" + message;
        }
      }
    },
    receiveMessage: function(callback, source_origin) {
      var attached_callback, interval_id;
      if (window["postMessage"]) {
        if (callback) {
          attached_callback = function(e) {
            if ((typeof source_origin === "string" && e.origin !== source_origin) || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1)) {
              console.log("cross iframe request blocked. Domains " + e.origin + " and " + source_origin + " must match.");
              return !1;
            }
            return callback(e);
          };
        }
        if (window["addEventListener"]) {
          return window[(callback ? "addEventListener" : "removeEventListener")]("message", attached_callback, !1);
        } else {
          return window[(callback ? "attachEvent" : "detachEvent")]("onmessage", attached_callback);
        }
      } else {
        interval_id && clearInterval(interval_id);
        interval_id = null;
        if (callback) {
          return interval_id = setInterval(function() {
            var hash, last_hash, re;
            hash = document.location.hash;
            re = /^#?\d+&/;
            if (hash !== last_hash && re.test(hash)) {
              last_hash = hash;
              return callback({
                data: hash.replace(re, "")
              });
            }
          }, 100);
        }
      }
    }
  };

  CrossDomain = (function() {

    CrossDomain.prototype.bar = $('#bar');

    function CrossDomain() {
      this.sendHeight = __bind(this.sendHeight, this);

      this.send = __bind(this.send, this);

      this.recieve = __bind(this.recieve, this);

      var parts;
      parts = decodeURIComponent(document.location.hash.replace(/^#/, '')).match(/([^:]+:\/\/.[^/]+)/);
      if (!(parts != null)) {
        return;
      }
      this.parent_url = parts[1];
      XD.receiveMessage(this.recieve, this.parent_url);
      Backbone.history.on('route', this.sendHeight);
    }

    CrossDomain.prototype.recieve = function(msg) {
      return MyGovBar.Router.navigate(msg.data, true);
    };

    CrossDomain.prototype.send = function(msg) {
      return XD.postMessage(msg, this.parent_url);
    };

    CrossDomain.prototype.sendHeight = function() {
      return this.send('height-' + this.bar.height() + 'px');
    };

    return CrossDomain;

  })();

  MyGovBar.CrossDomain = new CrossDomain();

  _.each(MyGovBar.config.tabs, function(tab) {
    return $("#tabs ." + tab).addClass("activated");
  });

  Backbone.history.start();

}).call(this);
