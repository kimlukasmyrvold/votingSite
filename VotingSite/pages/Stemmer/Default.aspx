<%@ Page Title="Stemmer" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Stemmer.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false">
        <Columns>
            <asp:BoundField DataField="Kommune" HeaderText="Kommune" />
            <asp:BoundField DataField="Parti" HeaderText="Parti" />
        </Columns>
    </asp:GridView>
</asp:Content>
