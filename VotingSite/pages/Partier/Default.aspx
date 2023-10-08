<%@ Page Title="Partier" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Partier.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="false">
        <Columns>
            <asp:BoundField DataField="PID" HeaderText="ID" />
            <asp:BoundField DataField="Parti" HeaderText="Parti" />
        </Columns>
    </asp:GridView>
</asp:Content>
