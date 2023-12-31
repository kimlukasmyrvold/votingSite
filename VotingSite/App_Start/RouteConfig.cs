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
            settings.AutoRedirectMode = RedirectMode.Off;
            routes.EnableFriendlyUrls(settings);

            routes.MapPageRoute("KommunerRoute", "Kommuner", "~/Pages/Kommuner/Default.aspx");
            routes.MapPageRoute("PersonerRoute", "Personer", "~/Pages/Personer/Default.aspx");
            routes.MapPageRoute("Privacy-TermsRoute", "Privacy-Terms", "~/Pages/Privacy-Terms/Default.aspx");
        }
    }
}