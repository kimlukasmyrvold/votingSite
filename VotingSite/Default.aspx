<%@ Page Title="Hjemmeside" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="VotingSite._Default" %>

<%--<%@ Register Assembly="System.Web.DataVisualization, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" Namespace="System.Web.UI.DataVisualization.Charting" TagPrefix="asp" %>--%>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <%--<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>--%>
    <script src="assets/js/home.js" defer></script>

  <%--  <div>
        <asp:Chart ID="Chart1" runat="server" Width="700px">
            <Series>
                <asp:Series Name="Series1"></asp:Series>
            </Series>
            <Series>
                <asp:Series Name="Series2"></asp:Series>
            </Series>
            <ChartAreas>
                <asp:ChartArea Name="ChartArea1"></asp:ChartArea>
            </ChartAreas>
        </asp:Chart>
    </div>--%>

    <%--  <asp:DropDownList ID="DropDownListKommuner" runat="server">
        <asp:ListItem Selected="True" Value="0">Velg Kommune...</asp:ListItem>
    </asp:DropDownList>--%>

    <div class="modal" data-visible="false">
        <div class="modal__container">
            <svg class="icon-cross"></svg>
            <div id="voteForm">
                <div class="container">

                    <div class="votingInfo">
                        <div class="partiLogo">
                            <img src="assets/images/parti_logos/.png" alt="Parti logo">
                        </div>
                        <p>Du har valgt: <span class="votingSelected">&nbsp</span></p>
                    </div>

                    <div class="personalInfo">
                        <label for="FNavn">Fornavn:</label>
                        <input type="text" id="FNavn" name="Fornavn" required title="foo" pattern="[a-zA-ZæøåÆØÅ\s]+">
                        <label for="ENavn">Etternavn:</label>
                        <input type="text" id="ENavn" name="Etternavn" required title="foo" pattern="[a-zA-ZæøåÆØÅ\s]+">
                        <label for="FNum">Fødselsnummer:</label>
                        <input type="text" id="FNum" name="Fødselsnummer" required title="foo" pattern="[0-9]{11}">
                        <span class="validation-message"></span>
                    </div>

                    <div class="location">
                        <div class="selectFylker">
                            <p>Velg Fylke</p>
                            <asp:DropDownList ID="DropDownListFylker" runat="server" AutoPostBack="True" OnSelectedIndexChanged="GetFromKommuner">
                                <asp:ListItem Selected="True" Value="0" Disabled="true">Velg Fylke...</asp:ListItem>
                            </asp:DropDownList>
                        </div>
                        <div class="selectKommuner">
                            <p>Velg Kommune</p>
                            <asp:DropDownList ID="DropDownListKommuner" runat="server">
                                <asp:ListItem Selected="True" Value="0" Disabled="true">Velg Kommune...</asp:ListItem>
                            </asp:DropDownList>
                        </div>
                    </div>

                    <div class="buttons">
                        <button class="cancel">Avbryt</button>
                        <button class="submit">Stem</button>
                    </div>

                </div>
            </div>

        </div>
    </div>

    <div class="partier">
        <div class="partier__container">

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/ap.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Arbeiderpartiet</p>
                        <hr>
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
                        <button class="voteBtn" data-id="ap">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/h.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Høyre</p>
                        <hr>
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
                        <button class="voteBtn" data-id="h">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/sp.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Senterpartiet</p>
                        <hr>
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
                        <button class="voteBtn" data-id="sp">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/frp.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Fremskrittspartiet</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            Fremskrittspartiet er et liberalistisk folkeparti. Vi jobber for en strengere innvandringspolitikk,
                            trygg eldreomsorg, gode sykehus, lavere skatter og avgifter og bedre veier. En enklere hverdag for
                            folk flest.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" data-id="frp">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/sv.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Sosialistisk Venstreparti</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            SV er partiet for deg som vil ha et samfunn med sterke fellesskap, små forskjeller, og en offensiv
                            plan for en rettferdig løsning på klimakrisen.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" data-id="sv">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/r.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Rødt</p>
                        <hr>
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
                        <button class="voteBtn" data-id="r">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/v.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Venstre</p>
                        <hr>
                    </div>
                    <div class="partier__description">
                        <p>
                            Venstre er et liberalt parti som ble stiftet i 1884. Venstre er det eldste partiet i Norge og har
                            vært med på å forme det norske demokratiet. Venstre har som mål å skape et grønt, rettferdig og
                            moderne samfunn der alle har like muligheter og frihet til å utvikle seg.
                        </p>
                    </div>
                    <div class="partier__vote">
                        <button class="voteBtn" data-id="v">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/mdg.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Miljøpartiet De Grønne</p>
                        <hr>
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
                        <button class="voteBtn" data-id="mdg">Stem på parti</button>
                    </div>
                </div>
            </div>

            <div class="partier__item">
                <div class="partier__logo">
                    <img src="assets/images/parti_logos/krf.png" alt="Parti logo">
                </div>
                <div class="partier__content">
                    <div class="partier__name">
                        <p>Kristelig Folkeparti</p>
                        <hr>
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
                        <button class="voteBtn" data-id="krf">Stem på parti</button>
                    </div>
                </div>
            </div>

        </div>
    </div>

</asp:Content>
