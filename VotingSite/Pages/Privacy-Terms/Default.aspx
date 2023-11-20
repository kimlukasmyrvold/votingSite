<%@ Page Title="Personvern og Vilkår" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite.Pages.Privacy.Default" %>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <article>
        <p class="heading" id="privacy">Personvern</p>

        <p class="subheading">What we do with your data.</p>
        <p>Your personal information are stored on an unsafe database.</p>
        <p>We use your information to confirm if you have already voted or not.</p>
        <p>We do not store information about what you voted on.</p>

        <p class="subheading">What information we store.</p>
        <p>We store you Name, National ID Number and municipality</p>
        <p>The party that you vote on will be stored in a seperate table not linked to your personal information.</p>
    </article>

    <article>
        <p class="heading" id="terms">Vilkår</p>

        <p>Ikke stem mer enn 1 gang.</p>
        <p>Ikke bruk andre sine fødselsnummere.</p>
        <p>Ikke stem for andre.</p>
        <p>Vær sikker på at du velger riktig parti, etter du har stemt får du ikke valgt noe annet.</p>
    </article>
</asp:Content>