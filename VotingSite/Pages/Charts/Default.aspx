<%@ Page Title="Charts" Language="C#" MasterPageFile="~/Site.Master" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Pages.Charts.Default" %>

<asp:Content ContentPlaceHolderID="HeadContent" runat="server">
    <link rel="stylesheet" href="/Content/CSS/charts.css">
    <script src="/Content/JavaScript/charts.js" defer></script>
</asp:Content>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <div class="barChart">
        <input type="hidden" ID="chartValues" runat="server" class="barChartValues"/>

        <div class="controls">
            <button class="button selected" data-option="percent">%</button>
            <button class="button" data-option="votes">Stemmer</button>
            <div class="custom-select">
                <asp:DropDownList ID="kommunerDropDown" runat="server">
                    <asp:ListItem Selected="True" Value="0">Alle kommuner</asp:ListItem>
                </asp:DropDownList>
            </div>
        </div>

        <div class="container"></div>
    </div>
</asp:Content>