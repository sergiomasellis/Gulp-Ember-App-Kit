var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

Router.map(function() {

    //SS Routes
    this.resource("content-page", {
        path: "/:page_id"
    });

    this.resource("identity-menu", {
        path: "/identity-menu"
    }, function() {
        this.route("section", {
            path: "/:subpage_id"
        });
    });

    this.resource("debit", {
        path: "/debit/:subpage_id"
    });
    this.resource("proof", {
        path: "/proof/:subpage_id"
    });

    this.resource("face", {
        path: "/face/:subpage_id"
    });
    this.resource("bill", {
        path: "/bill/:subpage_id"
    });
    this.resource("income", {
        path: "/income/:subpage_id"
    });
    this.resource("info", {
        path: "/info/:subpage_id"
    });
    this.resource("challenge", {
        path: "/challenge/:subpage_id"
    });

    this.resource("account", {
        path: "/account/:subpage_id"
    });

});

export
default Router;