// Generated by CoffeeScript 1.4.0
(function(){var e,t,n,r={}.hasOwnProperty,i=function(e,t){function i(){this.constructor=e}for(var n in t)r.call(t,n)&&(e[n]=t[n]);return i.prototype=t.prototype,e.prototype=new i,e.__super__=t.prototype,e},s=function(e,t){return function(){return e.apply(t,arguments)}};MyGovBar.Models.Page=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.paramRoot="page",t.prototype.urlRoot=MyGovBar.config.api_url+"/pages",t.prototype.url=function(){var e;return e=this.urlRoot,this.id!=null&&(e+="/"+this.id),e+=".json",e},t.prototype.lookup=function(){var e,t=this;return e=this.url,this.url=this.urlRoot+".json?url="+this.get("url")+"&callback=?",this.fetch({error:function(e,n){if(n.status!==404)return;return t.save()}}),this.url=e,this.trigger("change")},t.prototype.initialize=function(){return this.lookup()},t.prototype.defaults={url:document.referrer},t.prototype.parse=function(e){var t;if(e==null)return;return t=new MyGovBar.Collections.Tags,_.each(e.tags,function(e){return t.add(new MyGovBar.Models.Tag(e),{silent:!0})}),e.tags=t,e},t}(Backbone.Model),MyGovBar.Collections.PagesCollection=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.model=MyGovBar.Models.Page,t.prototype.url="/pages",t}(Backbone.Collection),MyGovBar.Models.Comment=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.url=function(){return MyGovBar.config.api_url+"/pages/"+this.get("page_id")+"/comments.json"},t.prototype.defaults=function(){return{page_id:MyGovBar.page.get("id"),body:""}},t}(Backbone.Model),MyGovBar.Collections.Comments=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.model=MyGovBar.Models.Comment,t}(Backbone.Collection),MyGovBar.Models.Tag=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.url=function(){return MyGovBar.config.api_url+"/tags"+this.get("name")+".json"},t.prototype.defaults={name:"",id:null},t}(Backbone.Model),MyGovBar.Collections.Tags=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.model=MyGovBar.Models.Tag,t.prototype.url=MyGovBar.config.api_url+"/tags",t.prototype.toJSON=function(){return this.pluck("name").join(", ")},t.prototype.initialize=function(){var e=this;return this.on("add remove",function(){return MyGovBar.page.save({tag_list:e.toJSON()})})},t}(Backbone.Collection),MyGovBar.Views.Mini=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.el="#bar",t.prototype.events={"click .expand a":"toggle","click #tabs li.related a":"related"},t.prototype.render=function(){var e;return this.$el.clearQueue(),this.$el.addClass("mini"),this.$el.addClass("shown"),this.$el.removeClass("expanded"),this.$el.removeClass("hidden"),$(".row").css("width",window.innerWidth+"px"),this.$el.animate({width:"100%"},1e3,function(){return $(".row").css("width","100%")}),e=new MyGovBar.Views.Related({model:this.model})},t.prototype.toggle=function(e){return e.preventDefault(),MyGovBar.Router.navigate("expanded",!0),!1},t.prototype.related=function(e){return e.preventDefault(),MyGovBar.Router.navigate("related",!0),!1},t}(Backbone.View),MyGovBar.Views.Related=function(e){function t(){return this.render=s(this.render,this),t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.el="#drawer",t.prototype.template=$("#related_template").html(),t.prototype["class"]="related",t.prototype.render=function(){var e;return e=_.template(this.template),this.$el.html(e(this.model.toJSON())),MyGovBar.CrossDomain.sendHeight()},t.prototype.initialize=function(){return this.model.on("change:related",this.render)},t}(Backbone.View),MyGovBar.Views.Feedback=function(e){function t(){return this.saveRating=s(this.saveRating,this),t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.el="#drawer",t.prototype.template=$("#feedback_template").html(),t.prototype.render=function(){var e;return this.model.off("change"),e=_.template(this.template),this.$el.html(e()),$("input.star").rating({callback:this.saveRating})},t.prototype.saveRating=function(e,t){return this.model.save({rating:e})},t}(Backbone.View),MyGovBar.Views.Hidden=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.el="#bar",t.prototype.render=function(){var e=this;return $(".row").css("width",window.innerWidth+"px"),this.$el.animate({width:"0px"},1e3,function(){return e.$el.removeClass("shown"),e.$el.addClass("hidden"),e.$el.removeClass("mini"),e.$el.removeClass("expanded"),e.$el.clearQueue(),$(".row").css("width","100%")})},t}(Backbone.View),MyGovBar.Views.Search=function(e){function t(){return this.submit=s(this.submit,this),t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.el="#drawer",t.prototype.template=$("#search_template").html(),t.prototype.events={"submit #search":"submit"},t.prototype.render=function(){var e;return e=_.template(this.template),this.$el.html(e())},t.prototype.submit=function(e){return e.preventDefault(),MyGovBar.Router.navigate("search/"+$("#search_query").val(),!0),!1},t}(Backbone.View),MyGovBar.Views.SearchResult=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.el="#drawer",t.prototype.template=$("#search_result_template").html(),t.prototype.render=function(){var e;return e=_.template(this.template),this.$el.html(e({query:this.query}))},t}(Backbone.View),MyGovBar.TagManager=function(){function e(){}return e.prototype.compareItems=function(e,t){return e.get("name")===t.get("name")?!0:!1},e.prototype.init=function(e){},e.prototype.filter=function(e,t){return _.filter(e.models,function(e){return this.itemContains(e,t)})},e.prototype.itemContains=function(e,t){return e.get("name").indexOf(query)===0},e.prototype.itemToString=function(e){return e.get("name")},e.prototype.stringToItem=function(e){var t;return t=new MyGovBar.Models.Tag,t.set("name",e),t},e}(),MyGovBar.Views.Tags=function(e){function t(){return this.render=s(this.render,this),t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.el="#drawer",t.prototype.template=$("#tags_template").html(),t.prototype.render=function(){var e;return e=_.template(this.template),this.$el.html(e({page:this.model.toJSON(),tags:this.model.get("tags").toJSON()})),$("#tag_list").textext({plugins:"tags autocomplete suggestsions ajax",tagsItems:this.model.get("tags").models,itemManager:MyGovBar.TagManager,ajax:{url:MyGovBar.config.api_url+"/tags.json"}}),$("#tag_list").unbind("setSuggestions"),$("#tag_list").on({setSuggestions:function(e,t){var n;return n=[],_.each(t.result,function(e){return n.push(new MyGovBar.Models.Tag(e))}),t.result=n,$("#tag_list").textext()[0].autocomplete().onSetSuggestions(e,t)}}),$("#tag_list").on("setFormData",function(e,t){return MyGovBar.page.get("tags").update(t)})},t}(Backbone.View),MyGovBar.Views.Expanded=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.el="#bar",t.prototype.events={"click #tabs li.tags a":"tags","click #tabs li.search a":"search","click #tabs li.feedback a":"feedback"},t.prototype.render=function(){var e=this;return this.$el.clearQueue(),this.$el.css("width",this.$el.css("width")),setTimeout(function(){return e.$el.animate({width:"100%"},1e3,function(){return e.$el.removeClass("mini"),e.$el.addClass("shown"),e.$el.addClass("expanded"),e.$el.removeClass("hidden"),MyGovBar.CrossDomain.sendHeight()})},1)},t.prototype.tags=function(e){return e.preventDefault(),MyGovBar.Router.navigate("tags",!0),!1},t.prototype.search=function(e){return e.preventDefault(),MyGovBar.Router.navigate("search",!0),!1},t.prototype.feedback=function(e){return e.preventDefault(),MyGovBar.Router.navigate("feedback",!0),!1},t}(Backbone.View),n=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return i(t,e),t.prototype.routes={hidden:"hide",expanded:"expand",related:"related",tags:"tags",search:"search","search/:query":"searchResult",feedback:"feedback",mini:"mini","*path":"minify"},t.prototype.initialize=function(){return MyGovBar.page=new MyGovBar.Models.Page,Backbone.history.on("route",this.setCurrent)},t.prototype.mini=function(){var e;return MyGovBar.CrossDomain.send("mini"),e=new MyGovBar.Views.Mini({model:MyGovBar.page}),e.render()},t.prototype.minify=function(){return this.navigate("mini",!0)},t.prototype.expand=function(){var e;return MyGovBar.CrossDomain.send("expanded"),e=new MyGovBar.Views.Expanded,e.render()},t.prototype.hide=function(){var e;return MyGovBar.CrossDomain.send("hidden"),e=new MyGovBar.Views.Hidden,e.render()},t.prototype.tags=function(){var e;return e=new MyGovBar.Views.Tags({model:MyGovBar.page}),e.render()},t.prototype.related=function(){var e;return e=new MyGovBar.Views.Related({model:MyGovBar.page}),e.render()},t.prototype.search=function(){var e;return e=new MyGovBar.Views.Search,e.render()},t.prototype.searchResult=function(e){var t;return t=new MyGovBar.Views.SearchResult,t.query=e,t.render()},t.prototype.feedback=function(){var e;return e=new MyGovBar.Views.Feedback({model:MyGovBar.page}),e.render()},t.prototype.setCurrent=function(){return $("#tabs li.current").removeClass("current"),$("#tabs li."+Backbone.history.fragment).addClass("current")},t}(Backbone.Router),MyGovBar.Router=new n,t={interval_id:void 0,last_hash:void 0,cache_bust:1,attached_callback:void 0,window:this,postMessage:function(e,t,n){if(!t)return;n=n||parent;if(window.postMessage)return n.postMessage(e,t.replace(/([^:]+:\/\/[^\/]+).*/,"$1"));if(t)return n.location=t.replace(/#.*$/,"")+"#"+ +(new Date)+cache_bust++ +"&"+e},receiveMessage:function(e,t){var n,r;if(window.postMessage)return e&&(n=function(n){return typeof t=="string"&&n.origin!==t||Object.prototype.toString.call(t)==="[object Function]"&&t(n.origin)===!1?(console.log("cross iframe request blocked. Domains "+n.origin+" and "+t+" must match."),!1):e(n)}),window.addEventListener?window[e?"addEventListener":"removeEventListener"]("message",n,!1):window[e?"attachEvent":"detachEvent"]("onmessage",n);r&&clearInterval(r),r=null;if(e)return r=setInterval(function(){var t,n,r;t=document.location.hash,r=/^#?\d+&/;if(t!==n&&r.test(t))return n=t,e({data:t.replace(r,"")})},100)}},e=function(){function e(){this.sendHeight=s(this.sendHeight,this),this.send=s(this.send,this),this.recieve=s(this.recieve,this);var e;e=decodeURIComponent(document.location.hash.replace(/^#/,"")).match(/([^:]+:\/\/.[^/]+)/);if(e==null)return;this.parent_url=e[1],t.receiveMessage(this.recieve,this.parent_url),Backbone.history.on("route",this.sendHeight)}return e.prototype.bar=$("#bar"),e.prototype.recieve=function(e){return MyGovBar.Router.navigate(e.data,!0)},e.prototype.send=function(e){return t.postMessage(e,this.parent_url)},e.prototype.sendHeight=function(){return this.send("height-"+this.bar.height()+"px")},e}(),MyGovBar.CrossDomain=new e,_.each(MyGovBar.config.tabs,function(e){return $("#tabs ."+e).addClass("activated")}),Backbone.history.start()}).call(this);