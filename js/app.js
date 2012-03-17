(function ($) {
    // Define Country model
    var Country = Backbone.Model.extend({});

    //define directory collection
    var Directory = Backbone.Collection.extend({
        model: Country
    });

    //define individual contact view
    var CountryView = Backbone.View.extend({
        tagName: "div",
        className: "mapContainer",
        template: _.template($("#mapTemplate").html()),

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    //define master view
    var DirectoryView = Backbone.View.extend({
        el: $("#main"),

        initialize: function () {
            this.collection = new Directory(countries);

            this.render();

            this.on("change:filterLanguage", this.filterByLanguage, this);
            this.collection.on("reset", this.render, this);
        },

        render: function () {
            this.$el.find("div").remove();

            _.each(this.collection.models, function (item) {
                this.renderCountry(item);
            }, this);
        },

        renderCountry: function (item) {
            var countryView = new CountryView({
                model: item
            });
            this.$el.append(countryView.render().el);
        },

        getLanguages: function () {
            return _.uniq(this.collection.pluck("language"));
        },

        //Set filter property and fire change event
        setFilter: function (e) {
            this.filterLanguage = e.currentTarget.value;
        },

        //filter the view
        filterByLanguage: function () {
            this.collection.reset(countries, { silent: true });

            var filterLanguage = this.filterLanguage,
                filtered = _.filter(this.collection.models, function (item) {
                    return item.get("language") === filterLanguage;
                });

            this.collection.reset(filtered);

            languageRouter.navigate("language/" + filterLanguage);
        }
    });

    //add routing
    var LanguageRouter = Backbone.Router.extend({
        routes: {
            "language/:language": "urlFilter"
        },

        urlFilter: function (language) {
            directory.filterLanguage = language;
            directory.trigger("change:filterLanguage");
        }
    });

    //create instance of master view
    var directory = new DirectoryView();

    //create router instance
    var languageRouter = new LanguageRouter();

    //start history service
    Backbone.history.start();

} (jQuery));