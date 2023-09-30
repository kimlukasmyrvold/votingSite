using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
//using System.Web.UI.DataVisualization.Charting;

namespace VotingSite
{
    public partial class _Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //if (Request.QueryString.Count > 0)
            //{
            //    Response.Write(Request.QueryString["result"]);
            //    string script = "removeQueryString();";
            //    ClientScript.RegisterStartupScript(GetType(), "MyScript", script, true);
            //}

            //if (!Page.IsPostBack)
            //{
            //    // getFromKommuner();
            //}
        }

        [WebMethod]
        public static string SayHello(string name)
        {
            return "Hello, " + name + "!";
        }

        // private void getFromKommuner()
        // {
        //     var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
        //     DataTable dt = new DataTable();
        //     using (SqlConnection conn = new SqlConnection(connString))
        //     {
        //         conn.Open();
        //         SqlCommand cmd = new SqlCommand("SELECT KID, Kommune from ViewKommuner order by Kommune COLLATE Danish_Norwegian_CI_AS", conn);
        //         cmd.CommandType = CommandType.Text;
        //         SqlDataReader reader = cmd.ExecuteReader();
        //         dt.Load(reader);
        //         reader.Close();
        //         conn.Close();
        //     }

        //     foreach (DataRow row in dt.Rows)
        //     {
        //         ListItem item = new ListItem(row["Kommune"].ToString(), row["KID"].ToString());
        //         DropDownListKommuner.Items.Add(item);
        //     }

        //     DropDownListKommuner.DataBind();
        // }

        // protected void ButtonVote_Click(object sender, EventArgs e)
        // {
        //     if (!(sender is Button button)) return;
        //     if (int.Parse(DropDownListKommuner.SelectedValue) == 0)
        //     {
        //         Response.Redirect(Request.Url.AbsolutePath + "?result=Error, du må velge en kommune");
        //     }

        //     string id;
        //     id = button.Attributes["data-id"];

        //     SqlParameter param;
        //     var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
        //     using (SqlConnection conn = new SqlConnection(connectionString))
        //     {
        //         conn.Open();

        //         SqlCommand cmd = new SqlCommand("INSERT INTO test (KID,PID) Values(@kid,@pid)", conn);
        //         cmd.CommandType = CommandType.Text;

        //         param = new SqlParameter("@kid", SqlDbType.Int);
        //         param.Value = int.Parse(DropDownListKommuner.SelectedValue);
        //         cmd.Parameters.Add(param);

        //         param = new SqlParameter("@pid", SqlDbType.Int);
        //         param.Value = int.Parse(id);
        //         cmd.Parameters.Add(param);

        //         cmd.ExecuteNonQuery();
        //         conn.Close();
        //     }

        //     Response.Redirect(Request.Url.AbsolutePath + "?result=Success");
        // }

    }
}