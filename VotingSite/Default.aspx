<%@ Page Title="Hjemmeside" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <script type="text/javascript" src="Scripts/main.js"></script>

    <asp:DropDownList ID="DropDownListKommuner" runat="server">
        <asp:ListItem Selected="True" Value="0">Velg Kommune...</asp:ListItem>
    </asp:DropDownList>

    <div class="partier">
        <div class="partier__container">

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="Content/images/parti_logos/ap.png" alt="Parti logo">
                </div>
                <div class="partier__name">
                    <p>Arbeiderpartiet</p>
                </div>
                <div class="partier__description">
                    <p>
                        Arbeiderpartiets visjon er en rettferdig verden uten fattigdom og i fred, der menneskene er frie,
                        likestilte og har innflytelse på sine liv. Alle mennesker er unike, uerstattelige og like mye verdt.
                        Hver av oss skal ha muligheten til å leve gode liv, i små og store fellesskap. Vi vil ha et samfunn
                        basert på frihet, solidaritet og like muligheter for alle.
                        <span class="space"></span>
                        Vår ideologi, eller grunnsyn eller samfunnssyn om du vil, er sosialdemokrati. Vi bygger vår politikk
                        på grunnverdiene frihet, likhet og solidaritet.
                    </p>
                </div>
                <div class="partier__vote">
                    <asp:Button ID="Button1" runat="server" Text="Stem på parti!" CssClass="voteBtn" data-id="1" OnClick="ButtonVote_Click" />
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="Content/images/parti_logos/h.png" alt="Parti logo">
                </div>
                <div class="partier__name">
                    <p>Høyre</p>
                </div>
                <div class="partier__description">
                    <p>
                        Høyre vil bygge samfunnet på tillit til enkeltmennesket. Hver enkelt skal ha størst mulig frihet til
                        og ansvar for å forme sitt eget liv og sin egen fremtid basert på respekt for andre og for
                        fellesskapet.
                        <span class="space"></span>
                        Samfunnet består av mennesker med ulik kulturell bakgrunn. Høyre mener at mangfold og forskjellighet
                        er en kilde til utveksling av ideer, fornyelse og kreativitet. Valgfrihet er en naturlig del av å
                        kunne bestemme over eget liv.
                    </p>
                </div>
                <div class="partier__vote">
                    <asp:Button ID="Button2" runat="server" Text="Stem på parti!" CssClass="voteBtn" data-id="2" OnClick="ButtonVote_Click" />
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="Content/images/parti_logos/sp.png" alt="Parti logo">
                </div>
                <div class="partier__name">
                    <p>Senterpartiet</p>
                </div>
                <div class="partier__description">
                    <p>
                        "Senterpartiet har som mål å legge vilkårene til rette for en harmonisk samfunnsutvikling. Et levende
                        folkestyre, bygget på kristen og nasjonal grunn, er en forutsetning for folkets trivsel og landets
                        fremgang.
                        <span class="space"></span>
                        Individet og menneskeverdet skal være det sentrale i samfunnet og vises tillit i fellesskapet. De
                        sosiale, kulturelle og økonomiske tiltak fra samfunnets side må ta sikte på å skape vekstvilkår og
                        trivsel for alle uansett bosted eller yrke."
                    </p>
                </div>
                <div class="partier__vote">
                    <asp:Button ID="Button3" runat="server" Text="Stem på parti!" CssClass="voteBtn" data-id="3" OnClick="ButtonVote_Click" />
                </div>
            </div>

            <div class="partier__item" id="frp">
                <div class="partier__logo">
                    <img src="Content/images/parti_logos/frp.png" alt="Parti logo">
                </div>
                <div class="partier__name">
                    <p>Fremskrittspartiet</p>
                </div>
                <div class="partier__description">
                    <p>
                        Fremskrittspartiet er et liberalistisk folkeparti. Vi jobber for en strengere innvandringspolitikk,
                        trygg eldreomsorg, gode sykehus, lavere skatter og avgifter og bedre veier. En enklere hverdag for
                        folk flest.
                    </p>
                </div>
                <div class="partier__vote">
                    <asp:Button ID="Button4" runat="server" Text="Stem på parti!" CssClass="voteBtn" data-id="4" OnClick="ButtonVote_Click" />
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="Content/images/parti_logos/sv.png" alt="Parti logo">
                </div>
                <div class="partier__name">
                    <p>Sosialistisk Venstreparti</p>
                </div>
                <div class="partier__description">
                    <p>
                        SV er partiet for deg som vil ha et samfunn med sterke fellesskap, små forskjeller, og en offensiv
                        plan for en rettferdig løsning på klimakrisen.
                    </p>
                </div>
                <div class="partier__vote">
                    <asp:Button ID="Button5" runat="server" Text="Stem på parti!" CssClass="voteBtn" data-id="5" OnClick="ButtonVote_Click" />
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="Content/images/parti_logos/r.png" alt="Parti logo">
                </div>
                <div class="partier__name">
                    <p>Rødt</p>
                </div>
                <div class="partier__description">
                    <p>
                        Økte forskjeller og privatisering truer alt det arbeiderbevegelsen har bygget opp i Norge - trygghet,
                        velferd og et sterkt fellesskap. Det gjør at makt og muligheter blir urettferdig fordelt. Folk
                        sorteres etter postnummer og bankkonto.
                        <span class="space"></span>
                        Samfunn bygget på samarbeid og likeverd er mer rettferdige enn samfunn basert på kapitalistisk
                        konkurranse. Fordi fellesskap fungerer. Derfor er kampen mot forskjells-Norge Rødts aller viktigste
                        sak.
                    </p>
                </div>
                <div class="partier__vote">
                    <asp:Button ID="Button6" runat="server" Text="Stem på parti!" CssClass="voteBtn" data-id="6" OnClick="ButtonVote_Click" />
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="Content/images/parti_logos/v.png" alt="Parti logo">
                </div>
                <div class="partier__name">
                    <p>Venstre</p>
                </div>
                <div class="partier__description">
                    <p>
                        Venstre er et liberalt parti som ble stiftet i 1884. Venstre er det eldste partiet i Norge og har
                        vært med på å forme det norske demokratiet. Venstre har som mål å skape et grønt, rettferdig og
                        moderne samfunn der alle har like muligheter og frihet til å utvikle seg.
                    </p>
                </div>
                <div class="partier__vote">
                    <asp:Button ID="Button7" runat="server" Text="Stem på parti!" CssClass="voteBtn" data-id="7" OnClick="ButtonVote_Click" />
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="Content/images/parti_logos/mdg.png" alt="Parti logo">
                </div>
                <div class="partier__name">
                    <p>Miljøpartiet De Grønne</p>
                </div>
                <div class="partier__description">
                    <p>
                        MDG er her for å stanse klima- og naturkrisa, med politikk som er bra for mennesker og miljø.
                        <span class="space"></span>
                        Klima- og naturkrisen er den største urettferdigheten i vår tid. Kortsiktig populisme, økende
                        forskjeller og miljøødeleggelser truer friheten og tryggheten mange av oss har tatt for gitt.
                        Motgiften er grønn politikk - og grønne politikere, som forstår at en bedre verden er mulig. Det
                        krever at vi våger å tenke nytt, lytter til fagkunnskap og samarbeider på tvers av grenser.
                        <span class="space"></span>
                        I MDG har vi som utgangspunkt at mennesker ikke er hevet over naturen, men at vi er en del av den.
                    </p>
                </div>
                <div class="partier__vote">
                    <asp:Button ID="Button8" runat="server" Text="Stem på parti!" CssClass="voteBtn" data-id="8" OnClick="ButtonVote_Click" />
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="Content/images/parti_logos/krf.png" alt="Parti logo">
                </div>
                <div class="partier__name">
                    <p>Kristelig Folkeparti</p>
                </div>
                <div class="partier__description">
                    <p>
                        Kristelig Folkeparti har i hele sin historie hatt som hovedmål å verne om kristelige og tradisjonelle
                        moralske verdier. Partiet har ikke noen utpreget klasseforankring, og har derfor heller ikke noen
                        skarpt definert økonomisk eller sosial profil. Den borgerlige profilen ble styrket i 1980- og
                        1990-årene. Dette kom særlig klart til uttrykk da Kåre Kristiansen var partileder noen år på 1970-
                        og 1980-tallet.
                    </p>
                </div>
                <div class="partier__vote">
                    <asp:Button ID="Button9" runat="server" Text="Stem på parti!" CssClass="voteBtn" data-id="9" OnClick="ButtonVote_Click" />
                </div>
            </div>

        </div>
    </div>

</asp:Content>
