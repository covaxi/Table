using System.Web;
using System.Web.Optimization;

namespace Table
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/jquery")
				.Include("~/Scripts/Libs/jquery-{version}.js")
				.Include("~/Scripts/Libs/jquery-ui-{version}.js"));

			bundles.Add(new ScriptBundle("~/bundles/modernizr")
				.Include("~/Scripts/Libs/modernizr-*"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap")
				.Include("~/Scripts/Libs/bootstrap.js")
				.Include("~/Scripts/Libs/respond.js"));

			bundles.Add(new ScriptBundle("~/bundles/react")
				.Include("~/Scripts/Libs/react.js")
				.Include("~/Scripts/Libs/react-dom.js")
				);

			bundles.Add(new ScriptBundle("~/bundles/table")
				.Include("~/Scripts/Table/api.js")
				.Include("~/Scripts/Table/controls.js")
				.Include("~/Scripts/Table/main.js"));

			bundles.Add(new StyleBundle("~/Content/css")
				.Include("~/Content/bootstrap.css")
				.Include("~/Content/jquery-ui.css")
				.Include("~/Content/site.css"));
		}
	}
}
