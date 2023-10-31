<%@ Page Title="Charts" Language="C#" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Pages.Charts.Default" %>

<asp:Content ContentPlaceHolderID="HeadContent" runat="server">
    <link rel="stylesheet" href="/Content/CSS/charts.css">
    <script src="/Content/JavaScript/charts.js" defer></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <div class="charts">
        <asp:HiddenField ID="chartValues" runat="server"></asp:HiddenField>

        <div class="controls">
            <button class="button percent selected">%</button>
            <button class="button votes">Stemmer</button>
            <div class="custom-select">
                <asp:DropDownList ID="kommunerDropDown" runat="server">
                    <asp:ListItem Selected="True" Value="0">Alle kommuner</asp:ListItem>
                </asp:DropDownList>
            </div>
        </div>


        <div class="chart">
            <div class="chart__container"></div>
        </div>
    </div>
</asp:Content>