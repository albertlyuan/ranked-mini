import { MathJax, MathJaxContext } from "better-react-mathjax";
import React from "react";
import {ranks} from "../rank-images/rankImages.js"



function CalculatingElo(){

    return (
        <div>
            <p>Elo is calculated with the following equation:</p>
            <BlockEquation text={"elo_{new} = elo_{old} + K(outcome_{actual} - outcome_{expected})"}/>
            <p>
                <InlineEquation text={"elo"}/> for new players starts at 0 and will never go below 0. 
                Average elo gain/loss per game will be around 16. 
            </p>
            <p>
                <InlineEquation text={"outcome_{actual}"}/> is a binary variable that is 1 if a player wins and 0 if a player loses.
            </p>
            <p>
                <InlineEquation text={"outcome_{expected}"}/> is the expected probability a player will win based on their elo relative to their opponent.
                For example, if a player's elo is much higher than the opponent, the expected outcome will be 0.9 or some decimal close to 1. 
                If a player's elo is very similar to the opponent, the expected outcome will be close to 0.5.
            </p>
            <ul>
                Expected outcome is calculated using the following formula:
            </ul>
            <BlockEquation text={"outcome_{expected} = \\frac{1}{1 + 10^{\\frac{elo_{opponent}-elo_{old}}{D}}}"}/>
            <ul>
                This equation is designed so that a player with <InlineEquation text={"D"}/> more elo points is 10 times as likely to win the game. 
                In our equation, <InlineEquation text={"D=400"}/> which is used in popular games like Chess, and League of Legends.
            </ul>
            <p>
                <InlineEquation text={"K"}/> is the K-factor (set at 32). 
                This determines the amount of elo an unweighted player will gain or lose. 
                Given two evenly matched teams, players will gain/lose 16 elo because
                <InlineEquation text={"K(outcome_{actual} - outcome_{expected}) = K(\\pm 0.5)"}/> 
                which is 16 in our case.
            </p>

            <h3>Which Elo is Used in the Calculation?</h3>
            <p>
                Mini is played with 3 people on each team, each with their own elo scores. 
                Since this is a team game, a team elo is calculated from a weighted average of each player's elo, 
                which is used in the elo equation as <InlineEquation text={"elo_{old}"}/> or <InlineEquation text={"elo_{opponent}"}/>.
            </p>

            <h4>Losses</h4>
            <p>
                In losing games, <InlineEquation text={"elo_{old} = min(elo_{individual}, elo_{team})"}/>.
                The motivation for this is that we don't want a high elo player to be penalized more for playing with lower elo players 
                and we don't want to penalize lower elo players for playing high level competition.
            </p>
            <ul>
                <h5>Ex) 1 high elo player + 2 low elo players LOSES </h5>
                <p>
                    Traditionally, the high elo player would lose significant points for losing to a lower elo team. 
                    However, by using team elo, the high elo player would lose less since the team elo is lower.
                </p>
                <p>
                    We don't want to use the team elo for low elo players because it's likely that the 
                    team elo is higher than the individual elo, meaning that the low elo players would 
                    lose more points than they should've (due to <InlineEquation text={"K(outcome_{actual} - outcome_{expected}) = K(0-outcome_{expected})"}/> 
                    being more negative).
                </p>
            </ul>

            <h4>Wins</h4>
            <p>
                In winning games, <InlineEquation text={"elo_{old} = elo_{individual}"}/>.
                The motivation for this is that we want low elo players to gain more for winning against high level competition
                and we don't want high elo players farming points in low elo games.
            </p>
            <ul>
                <h5>Ex) 1 high elo player + 2 low elo players WINS AGAINST low elo team </h5>
                <p>
                    If we used the same system as for losing games, a high elo player would gain more points 
                    because the team elo is closer to the opponent elo. This makes <InlineEquation text={"K(outcome_{actual} - outcome_{expected}) = K(1-outcome_{expected})"}/>
                    closer to 1. Instead we use the player's true elo so they only gain a little bit.
                    Meanwhile the low elo players should gain a normal amount.
                </p>
                
                <h5>Ex) 1 high elo player + 2 low elo players WINS AGAINST high elo team </h5>
                <p>
                    Here we want the high elo player to gain a normal amount and the low elo players to gain a sigificantly higher amount.
                    Using team elo would make the high elo player gain significanly more (because their elo is lowered) and the lower elo 
                    players gain a still significant amount but less than if individual elo was used.
                </p>
            </ul>

            <h4>Weighted Team Elo *WIP</h4>
            <p>
                We believe if a team has 1 exceptionally strong player and 2 weak players, 
                while their average elo may be low, their expected outcome is likely a bit higher than what that average represents. 
                To account for this, when calculating team elo, each player's elo is increased by a factor determined by the following logistic equation:
            </p>
            <BlockEquation text={"elo_{weighted} = elo + \\frac{L}{1 + e^{-s(x-m)}}"}/>
            <p>
                This equation is designed so that players with low elos will be altered very little and players with high elos will have significant alterations.
                Our equations have the following values:
            </p>
            <p><InlineEquation text={"L = 200"}/> signifies that 200 is the highest amount that can be added to a player's elo</p>
            <p><InlineEquation text={"s = 0.005"}/> signifies the slope of the logicstic curve.</p>
            <p><InlineEquation text={"m = 400"}/> signifies the midpoint of the logicstic curve. Players with 400 elo will have 100 elo added</p>
            <p>This means if a team has a player with 500 elo and 2 players with 50 elo, the team elo would be <InlineEquation text={"\\frac{(500+124.492)+(50+29.609)+(50+29.609)}{3}=261.23"}/> rather than <InlineEquation text={"\\frac{500+50+50}{3}=200"}/> </p>
            <p>* these values are actively being tuned</p>


            <h3>Unranked Uncertainty *WIP</h3>
            <p>
                Since new players may come in with a higher or lower expected outcome, there is uncertainty in how much <InlineEquation text={"outcome_{expected}"}/> actually is.
                To account for this, <InlineEquation text={"K"}/> can be set higher  during the first few games played. 
                In our system, <InlineEquation text={"K=96"}/> which is 3 times larger than normal.
                During this 10 game placement period, a player will be the 'Unranked' <img title={ranks[0][0].split("static/media/")[1].split(".")[0]} class="rankImg" src={ranks[0][0]}></img> rank.
            </p>

        </div>
    )
}

function InlineEquation({text}){
    return(
        <MathJaxContext>
              <MathJax inline>{ `\\(${text}\\)` }</MathJax>
        </MathJaxContext>
    )
}

function BlockEquation({text}){
    return(
        <MathJaxContext>
              <MathJax>{ `\\[${text}\\]` }</MathJax>
        </MathJaxContext>
    )
}

export {CalculatingElo}

