<%@ Page Title="Charts" Language="C#" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Pages.Charts.Default" %>

<asp:Content ContentPlaceHolderID="HeadContent" runat="server">
    <link rel="stylesheet" href="/Content/CSS/charts.css">
    <script src="/Content/JavaScript/charts.js" defer></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <asp:HiddenField ID="chartValues" runat="server"></asp:HiddenField>

    <asp:GridView ID="GridView_VoteCount" runat="server"></asp:GridView>
    <asp:GridView ID="GridView_VoteCountPercent" runat="server"></asp:GridView>

    <div class="chart__container"></div>
</asp:Content>