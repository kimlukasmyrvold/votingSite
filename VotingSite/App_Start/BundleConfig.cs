using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;
using System.Web.UI;

namespace VotingSite
{
    public class BundleConfig
    {
        // For more information on Bundling, visit https://go.microsoft.com/fwlink/?LinkID=303951
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/WebFormsJs").Include(
                            "~/Content/JavaScript/WebForms/WebForms.js",
                            "~/Content/JavaScript/WebForms/WebUIValidation.js",
                            "~/Content/JavaScript/WebForms/MenuStandards.js",
                            "~/Content/JavaScript/WebForms/Focus.js",
                            "~/Content/JavaScript/WebForms/GridView.js",
                            "~/Content/JavaScript/WebForms/DetailsView.js",
                            "~/Content/JavaScript/WebForms/TreeView.js",
                            "~/Content/JavaScript/WebForms/WebParts.js"));

            // Order is very important for these files to work, they have explicit dependencies
            bundles.Add(new ScriptBundle("~/bundles/MsAjaxJs").Include(
                    "~/Content/JavaScript/WebForms/MsAjax/MicrosoftAjax.js",
                    "~/Content/JavaScript/WebForms/MsAjax/MicrosoftAjaxApplicationServices.js",
                    "~/Content/JavaScript/WebForms/MsAjax/MicrosoftAjaxTimer.js",
                    "~/Content/JavaScript/WebForms/MsAjax/MicrosoftAjaxWebForms.js"));
        }
    }
}