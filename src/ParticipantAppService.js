export default {
  getStepperContent,

  goToPrevStep,
  goToNextStep,

  onGameSelected,

  restartApp,
  submitInfo
}

function getStepperContent() {
  switch (this.state.activeStep) {
    case 0:
      return this.renderLoginPage();
    case 1:
      return this.renderSelectionPage();
    case 2:
      return this.renderEndPage();
    default:
      break;
  }
}

function goToPrevStep() {
  this.setState({activeStep: this.state.activeStep - 1});
}

function goToNextStep() {
  this.setState({activeStep: this.state.activeStep + 1});
}

function onGameSelected(gameKey, gameRank) {
  const numGamesSelected = Object.keys(this.state.userSelections).length;
  if (numGamesSelected !== 3 || this.state.userSelections.hasOwnProperty(
      gameKey)) {
    if (gameRank === 0) {
      this.state.userSelections[gameKey] = numGamesSelected
          + 1;
    } else {
      this.state.userSelections = updateRankings(this.state.userSelections,
          gameKey, gameRank);
    }
    this.setState(
        {userSelections: this.state.userSelections, errorMessage: null});
  } else {
    this.setState({
      errorMessage: "You can only choose up to three games! Please deselect a game before selecting another."
    });
    setTimeout(() => this.setState({errorMessage: null}), 3000);
  }
}

function updateRankings(userSelections, gameKey, gameRank) {
  delete userSelections[gameKey];
  for (const gameId of Object.keys(userSelections)) {
    if (userSelections[gameId] > gameRank) {
      userSelections[gameId] = userSelections[gameId] - 1;
    }
  }
  return userSelections;
}

function restartApp() {
  this.setState({
    activeStep: 0,
    errorMessage: null,
    userName: null,
    userSelections: {}
  })
}

async function submitInfo() {
  await this.props.updateGameMappings(this.state.userSelections,
      this.state.userName);
}

