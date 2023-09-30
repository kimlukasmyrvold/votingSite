<%@ Page Title="Kommuner" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Kommuner.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false" AllowSorting="true" OnSorting="GridView1_Sorting">
        <Columns>
            <asp:BoundField DataField="KID" HeaderText="Kommune ID" SortExpression="KID" />
            <asp:BoundField DataField="Kommune" HeaderText="Kommune" SortExpression="Kommune" />
            <asp:BoundField DataField="Fylke" HeaderText="Fylke" SortExpression="Fylke" />
        </Columns>
    </asp:GridView>
</asp:Content>
