import { MathJax, MathJaxContext } from "better-react-mathjax";
import React from "react";
import {ranks} from "../rank-images/rankImages.js"
import {STARTING_ELO, PULL_FACTOR, NormalK, UnrankedK,D,L,slope,midpoint, weightedRank} from "../Elo/elo.js"
import { getCurrPullFactor, PULLFACTORGAMES } from "../Firebase/database.js";

export default function CalculatingElo(){

    return (
        <div class="animatedLoad">
            <h2>Calculating Elo</h2>

            <p>The basic elo formula is the following equation:</p>
            <BlockEquation text={"elo_{new} = elo_{old} + K(outcome_{actual} - outcome_{expected})"}/>
            <p>However, we use a slightly altered equation:</p>
            <BlockEquation text={"elo_{new} = elo_{old} + \\frac{K(outcome_{actual} - outcome_{expected})}{PullFactor}"}/>

            <h4>Elo</h4>
            <p>
                <InlineEquation text={"elo"}/> for new players starts at {STARTING_ELO} and will never go below 0. 
                Average elo gain/loss per game will be around {NormalK/2}. 
            </p>

            <h4>Actual Outcome</h4>
            <p>
                <InlineEquation text={"outcome_{actual}"}/> is a binary variable that is 1 if a player wins and 0 if a player loses.
            </p>

            <h4>Expected Outcome</h4>
            <p>
                <InlineEquation text={"outcome_{expected}"}/> is the expected probability a player will win based on their elo relative to their opponent.
                For example, if a player's elo is much higher than the opponent, the expected outcome will be 0.9 or some decimal close to 1. 
                If a player's elo is very similar to the opponent, the expected outcome will be close to 0.5.
            </p>
            <p>
                The expected outcome formula is the following:
            </p>
            <BlockEquation text={"outcome_{expected} = \\frac{1}{1 + 10^{\\frac{elo_{opponent}-elo_{old}}{D}}}"}/>
            <p>
                This equation is designed so that a player with <InlineEquation text={"D"}/> more elo points is 10 times as likely to win the game. 
                We use <InlineEquation text={"D="+D}/> which is used in popular games like Chess and League of Legends.
            </p>

            <h4>Pull Factor</h4>
            <p>
                Since mini is make-it-take-it, the team that pulls must get a D and score 3 times which is much harder than receiving a pull and scoring 3 times.
                From a test session of mini, it was found that teams who pulled won 23% of games and lost 77%. This means that receiving the pull makes it so winning
                is about 3 times more likely (0.23/0.77 = 3.34782608 times less likely to win). Thus we currently have set <InlineEquation text={"PullFactor=.23/.77="+PULL_FACTOR}/> 
                which is calculated from <InlineEquation text={"\\frac{P(PullAndWin)}{P(PullAndLose)}"}/>.
                The rationale behind this is that since breaking to win is much harder, we want to reward players who do so by giving them more elo gain. Likewise,
                holding to win is much easier so we want to reward less elo gain to penalize players who only receive.
            </p>
            <p>In the following examples, <InlineEquation text={"K=32"}/>, and the 2 teams have the same initial elo so <InlineEquation text={"outcome_{expected}=0.5"}/>:</p>
            <BlockEquation text={"elo_{gain} = \\frac{K(outcome_{actual} - outcome_{expected})}{PullFactor}"}/>
            <p>If there was no PullFactor, the base elo gain/loss would be <InlineEquation text={`${NormalK}*(\\pm0.5)`+"="+(NormalK*0.5).toFixed(2)}/></p>

            <ul>
                <h5>Ex) Pulling team broke to win</h5>
                <p>The winning team gains <InlineEquation text={`\\frac{${NormalK}*(1-0.5)}{${PULL_FACTOR.toFixed(4)}}`+"="+(NormalK*0.5/PULL_FACTOR).toFixed(2)}/> ({((NormalK*0.5/PULL_FACTOR)/(NormalK*0.5)).toFixed(3)} multiplier).</p>
                <p>The losing team loses <InlineEquation text={`\\frac{${NormalK}*(0-0.5)}{${PULL_FACTOR.toFixed(4)}}`+"="+(NormalK*-0.5/PULL_FACTOR).toFixed(2)}/>.</p>
            </ul>
            <ul>
                <h5>Ex) Receiving team holds</h5>
                <p>The winning team gains <InlineEquation text={`\\frac{${NormalK}*(1-0.5)}{1/${PULL_FACTOR.toFixed(4)}}`+"="+(NormalK*0.5/(1/PULL_FACTOR)).toFixed(2)}/> ({((NormalK*0.5/(1/PULL_FACTOR))/(NormalK*0.5)).toFixed(3)} multiplier).</p>
                <p>The losing team loses <InlineEquation text={`\\frac{${NormalK}*(0-0.5)}{1/${PULL_FACTOR.toFixed(4)}}`+"="+(NormalK*-0.5/(1/PULL_FACTOR)).toFixed(2)}/>.</p>
            </ul>
            <p>
                As seen from the examples shown, a game where the winner pulls results in much more elo being gained/lost. 
                Thus, we reward players that break to win and penalize players that get broken to win.
            </p>

            <p>11/13/23: Instead of a fixed PullFactor, a dynamic PullFactor calculated from the pull percentages of the past {PULLFACTORGAMES} games, is used.</p>

            <h4>K and Unranked Uncertainty</h4>
            <p>
                <InlineEquation text={"K"}/> (set at {NormalK}) determines the amount of elo an unweighted player will gain or lose. 
                Given two evenly matched teams, players will gain/lose {NormalK/2} elo because
                <InlineEquation text={"K(outcome_{actual} - outcome_{expected}) = K([1,0] - 0.5) = "+NormalK + "*(\\pm 0.5) = \\pm" + NormalK/2}/>
            </p>
            <p>
                Since new players may come in with a higher or lower expected outcome, there is uncertainty in how much <InlineEquation text={"outcome_{expected}"}/> actually is.
                To account for this, <InlineEquation text={"K"}/> can be set higher during the first few games played, which allows for players can get to an elo that is more representative of their skill in less time.
                We use <InlineEquation text={"K="+UnrankedK}/> during this period which is {UnrankedK/NormalK} times larger than normal.
                During this 10 game placement period, a player will be the 'Unranked' <img title={ranks[0][0].split("static/media/")[1].split(".")[0]} class="rankImg" src={ranks[0][0]}></img> rank.
            </p>
   

            <h2>Using Player Elo and Team Elo</h2>
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

            <h4>Weighted Team Elo</h4>
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
            <p><InlineEquation text={"L = "+L}/> signifies that {L} is the highest amount that can be added to a player's elo</p>
            <p><InlineEquation text={"s = "+slope}/> signifies the slope of the logicstic curve.</p>
            <p><InlineEquation text={"m = "+midpoint}/> signifies the midpoint of the logicstic curve. Players with {midpoint} elo will have {L/2} elo added</p>
            <p>
                This means if a team has a player with 900 elo and 2 players with 100 elo, the team elo would be 
                <InlineEquation text={"\\frac{(900+"+(weightedRank(900)-900).toFixed(2)+")+(100+"+(weightedRank(100)-100).toFixed(2)+")+(100+"+(weightedRank(100)-100).toFixed(2)+")}{3}="+((weightedRank(100)*2+weightedRank(900))/3).toFixed(2)}/> 
                rather than <InlineEquation text={"\\frac{900+100+100}{3}=366.67"}/> 
            </p>
            <p>* these values are actively being tuned</p>


      
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

