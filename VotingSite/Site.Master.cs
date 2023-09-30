using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.Optimization;

namespace VotingSite
{
    public partial class SiteMaster : MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
            }
        }

        private void getFromFylker()
        {
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT FID, Fylke from Fylker order by Fylke COLLATE Danish_Norwegian_CI_AS", conn);
                cmd.CommandType = CommandType.Text;
                SqlDataReader reader = cmd.ExecuteReader();
                dt.Load(reader);
                reader.Close();
                conn.Close();
            }

            foreach (DataRow row in dt.Rows)
            {
                ListItem item = new ListItem(row["Fylke"].ToString(), row["FID"].ToString());
                DropDownListFylker.Items.Add(item);
            }

            DropDownListFylker.DataBind();
        }

        private void getFromKommuner()
        {
            DropDownListKommuner.Items.Clear();

            SqlParameter param;
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            DataTable dt = new DataTable();
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT KID, Kommune from Kommuner, Fylker where Kommuner.FID = Fylker.FID and Fylker.FID=@fid", conn);
                cmd.CommandType = CommandType.Text;

                param = new SqlParameter("@fid", SqlDbType.Int);
                param.Value = int.Parse(DropDownListFylker.SelectedValue);
                cmd.Parameters.Add(param);

                SqlDataReader reader = cmd.ExecuteReader();
                dt.Load(reader);
                reader.Close();
                conn.Close();
            }

            foreach (DataRow row in dt.Rows)
            {
                ListItem item = new ListItem(row["Kommune"].ToString(), row["KID"].ToString());
                DropDownListKommuner.Items.Add(item);
            }

            DropDownListKommuner.DataBind();
            //ClientScript.RegisterStartupScript(GetType(), "MyScript", "AddReadyClassToParentDiv();", true);
            ScriptManager.RegisterStartupScript(this, GetType(), "AddReadyClass", "AddReadyClassToSelectKommuner();", true);
        }

        protected void getKommuner_Click(object sender, EventArgs e)
        {
            getFromKommuner();
        }

    }
}