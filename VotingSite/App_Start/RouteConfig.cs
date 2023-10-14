using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Routing;
using Microsoft.AspNet.FriendlyUrls;

namespace VotingSite
{
    public static class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            var settings = new FriendlyUrlSettings();
            settings.AutoRedirectMode = RedirectMode.Permanent;
            routes.EnableFriendlyUrls(settings);

            // Add custom routes for specific pages
            routes.MapPageRoute("ChartskkRoute", "charts", "~/pages/Charts/Default.aspx");
            routes.MapPageRoute("StemmerRoute", "stemmer", "~/pages/Stemmer/Default.aspx");
            routes.MapPageRoute("KommunerRoute", "kommuner", "~/pages/Kommuner/Default.aspx");
            routes.MapPageRoute("PartierRoute", "partier", "~/pages/Partier/Default.aspx");
            routes.MapPageRoute("PersonerRoute", "personer", "~/pages/Personer/Default.aspx");
            routes.MapPageRoute("PrivacyRoute", "privacy", "~/pages/Privacy/Default.aspx");
        }
    }
}
