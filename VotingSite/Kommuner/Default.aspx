<%@ Page Title="Kommuner" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Kommuner.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false">
        <Columns>
            <asp:BoundField DataField="KID" HeaderText="ID" />
            <asp:BoundField DataField="KNavn" HeaderText="Name" />
        </Columns>
    </asp:GridView>
</asp:Content>
