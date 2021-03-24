import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
    UserPoolId: "us-east-1_lrCzjoUto",
    ClientId: "3h8auo09d6vlbihsjdi6sigm3p"
}

export default new CognitoUserPool(poolData);
