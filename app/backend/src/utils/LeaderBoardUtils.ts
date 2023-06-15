import InterfaceTeamLeaderBoard from '../Interfaces/InterfaceTeamLeaderBoard';
import Matches from '../database/models/MatchesModel';

type TypeGoals = 'homeTeamGoals' | 'awayTeamGoals';

const listOfGoals: TypeGoals[] = ['homeTeamGoals', 'awayTeamGoals'];
const listOfGoals2: TypeGoals[] = ['awayTeamGoals', 'homeTeamGoals'];

export const countGoals = (matche: Matches[], goals: TypeGoals) =>
  matche.reduce((acc, curr) => acc + curr[goals], 0);

export const totalVLD = (matche: Matches[], goals: TypeGoals[]) => {
  let victories = 0;
  let losses = 0;
  let draws = 0;

  matche.forEach((e) => {
    if (e[goals[0]] === e[goals[1]]) draws += 1;
    if (e[goals[0]] > e[goals[1]]) victories += 1;
    if (e[goals[0]] < e[goals[1]]) losses += 1;
  });

  return { victories, losses, draws };
};

export const calculateTotalPoints = (matche: Matches[], goals: TypeGoals[]): number => {
  const { victories, draws } = totalVLD(matche, goals);
  return (victories * 3) + draws;
};

export const calculateGoalsBalance = (matche: Matches[], goals: TypeGoals[]): number =>
  countGoals(matche, goals[0]) - countGoals(matche, goals[1]);

export const calculateEfficiency = (matche: Matches[], goals: TypeGoals[]): string => {
  const points = calculateTotalPoints(matche, goals);
  const time = matche.length;
  const result = (points / (time * 3)) * 100;
  return result.toFixed(2);
};

export const calculateOverallEfficiency = (matcheHome:
Matches[], matcheAway: Matches[]): string => {
  const points = calculateTotalPoints(matcheHome, listOfGoals)
    + calculateTotalPoints(matcheAway, listOfGoals2);
  const time = matcheHome.length + matcheAway.length;
  const result = (points / (time * 3)) * 100;
  return result.toFixed(2);
};

export const getLeaderboardResults = (teamname: string, matche: Matches[], goals: TypeGoals[]) => ({
  name: teamname,
  totalPoints: calculateTotalPoints(matche, goals),
  totalGames: matche.length,
  totalVictories: totalVLD(matche, goals).victories,
  totalDraws: totalVLD(matche, goals).draws,
  totalLosses: totalVLD(matche, goals).losses,
  goalsFavor: countGoals(matche, goals[0]),
  goalsOwn: countGoals(matche, goals[1]),
  goalsBalance: calculateGoalsBalance(matche, goals),
  efficiency: calculateEfficiency(matche, goals),
});

export const leaderboardAll = (teamName: string, matcheHome: Matches[], matcheAway: Matches[]) => ({
  name: teamName,
  totalPoints: calculateTotalPoints(matcheHome, listOfGoals)
    + calculateTotalPoints(matcheAway, listOfGoals2),
  totalGames: matcheHome.length + matcheAway.length,
  totalVictories: (totalVLD(matcheHome, listOfGoals).victories
    + totalVLD(matcheAway, listOfGoals2).victories),
  totalDraws: (totalVLD(matcheHome, listOfGoals).draws
    + totalVLD(matcheAway, listOfGoals2).draws),
  totalLosses: (totalVLD(matcheHome, listOfGoals).losses
    + totalVLD(matcheAway, listOfGoals2).losses),
  goalsFavor: countGoals(matcheHome, listOfGoals[0]) + countGoals(matcheAway, listOfGoals[1]),
  goalsOwn: countGoals(matcheHome, listOfGoals[1]) + countGoals(matcheAway, listOfGoals[0]),
  goalsBalance: calculateGoalsBalance(matcheHome, listOfGoals)
    + calculateGoalsBalance(matcheAway, listOfGoals2),
  efficiency: calculateOverallEfficiency(matcheHome, matcheAway),
});

export const orderResults = (teams: InterfaceTeamLeaderBoard[]) =>
  teams.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.totalVictories !== b.totalVictories) return b.totalVictories - a.totalVictories;
    if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
    if (a.goalsFavor !== b.goalsFavor) return b.goalsFavor - a.goalsFavor;
    return a.goalsOwn - b.goalsOwn;
  });
