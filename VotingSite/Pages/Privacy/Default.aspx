<%@ Page Title="Personvern" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Pages.Privacy.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <h1>What we do with your data.</h1>
    <p>Your personal information are stored on an unsafe database.</p>
    <p>We use your information to confirm if you have already voted or not.</p>
    <p>We do not store information about what you voted on.</p>
    <h2>What information we store.</h2>
    <p>We store you Name, National ID Number and municipality</p>
    <p>The party that you vote on will be stored in a seperate table not linked to your personal information.</p>
</asp:Content>