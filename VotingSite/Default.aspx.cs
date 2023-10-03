using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography;
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
            if (Request.QueryString.Count > 0)
            {
                // Response.Write(Request.QueryString["result"]);
                //string script = "removeQueryString();";
                //ClientScript.RegisterStartupScript(GetType(), "MyScript", script, true);
            }

            if (!Page.IsPostBack)
            {
                //Response.Write(GetFromPersoner("01088469169"));
                //SendToPersoner("John", "Steve", "10039642789", 123);
                GetFromFylker();
            }

        }

        private void GetFromFylker()
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

        protected void GetFromKommuner(object sender, EventArgs e)
        {
            // Clear list to prevent duplicated values
            DropDownListKommuner.Items.Clear();

            // Get the values from database
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

            // Add the values to list
            foreach (DataRow row in dt.Rows)
            {
                ListItem item = new ListItem(row["Kommune"].ToString(), row["KID"].ToString());
                DropDownListKommuner.Items.Add(item);
            }

            // Bind the values
            DropDownListKommuner.DataBind();

            // Calling JavaScript 
            string script = @"
                document.addEventListener('DOMContentLoaded', () => {
                    getFromKommuner_Callback();
                });
            ";
            ScriptManager.RegisterStartupScript(this, GetType(), "callFunctions", script, true);
        }

        private void SendToPersoner(string FNavn, string ENavn, string FNum, int KID)
        {
            SqlParameter param;
            var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("INSERT INTO personer (FNavn,ENavn,FNum,KID) Values(@FNavn,@ENavn,@FNum,@KID)", conn);
                cmd.CommandType = CommandType.Text;

                // Param for Fornavn
                param = new SqlParameter("@FNavn", SqlDbType.VarChar);
                param.Value = FNavn;
                cmd.Parameters.Add(param);

                // Param for Etternavn
                param = new SqlParameter("@ENavn", SqlDbType.VarChar);
                param.Value = ENavn;
                cmd.Parameters.Add(param);

                // Param for Fødselsnummer
                param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = FNum;
                cmd.Parameters.Add(param);

                // Param for Kommune ID
                param = new SqlParameter("@KID", SqlDbType.Int);
                param.Value = KID;
                cmd.Parameters.Add(param);

                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        private bool GetFromPersoner(string FNum)
        {
            bool personExists = false;

            // Get persons from database
            SqlParameter param;
            var connString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * from personer WHERE FNum = @FNum", conn);
                cmd.CommandType = CommandType.Text;

                param = new SqlParameter("@FNum", SqlDbType.VarChar);
                param.Value = FNum;
                cmd.Parameters.Add(param);

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    // Checking if person exists within database
                    personExists = true;
                }

                reader.Close();
                conn.Close();
            }

            // return true if person exists in database
            return personExists;
        }

        protected void SendToStemmer_Click(object sender, EventArgs e)
        {
            if (!(sender is Button button)) return;
            if (int.Parse(DropDownListKommuner.SelectedValue) == 0)
            {
                //Response.Redirect(Request.Url.AbsolutePath + "?result=Error, du må velge en kommune");
                return;
            }

            //string pid = button.Attributes["data-pid"];
            string pid = Request.Form["pid"];

            SqlParameter param;
            var connectionString = ConfigurationManager.ConnectionStrings["ConnCms"].ConnectionString;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("INSERT INTO test (KID,PID) Values(@kid,@pid)", conn);
                cmd.CommandType = CommandType.Text;

                param = new SqlParameter("@kid", SqlDbType.Int);
                param.Value = int.Parse(DropDownListKommuner.SelectedValue);
                cmd.Parameters.Add(param);

                param = new SqlParameter("@pid", SqlDbType.Int);
                param.Value = int.Parse(pid);
                cmd.Parameters.Add(param);

                cmd.ExecuteNonQuery();
                conn.Close();
            }

            //Response.Redirect(Request.Url.AbsolutePath);
        }

    }
}