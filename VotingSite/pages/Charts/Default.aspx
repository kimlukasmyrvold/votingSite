<%@ Page Title="Charts" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.pages.Charts.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false">
        <Columns>
            <asp:BoundField DataField="PID" HeaderText="ID" />
            <asp:BoundField DataField="PNavn" HeaderText="Parti" />
        </Columns>
    </asp:GridView>

    <h1 id="count" runat="server">88</h1>
</asp:Content>
