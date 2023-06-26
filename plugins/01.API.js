class Twitter {
  constructor(path) {
    this.localPath = `${path}/twitter`;
  }

  async checkAuth({ authCode, codeChallenge }) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        authCode,
        codeChallenge
      }),
      headers: { 'content-type': 'application/json' }
    });
  }
}
class Discord {
  constructor(path) {
    this.localPath = `${path}/discord`;
  }

  async checkAuth(authCode) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        authCode
      }),
      headers: { 'content-type': 'application/json' }
    });
  }
}
class Google {
  constructor(path) {
    this.localPath = `${path}/google`;
  }

  async checkAuth(token) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        token
      }),
      headers: { 'content-type': 'application/json' }
    });
  }
}
class Signatures {
  constructor(path) {
    this.localPath = `${path}/signatures`;
  }

  async create({
    blockchain,
    walletAddress,
    signatureType,
    accessToken
  }) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      body: JSON.stringify({
        blockchain,
        walletAddress,
        signatureType
      }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
class User {
  constructor(path) {
    this.localPath = `${path}/users`;
  }

  async get(accessToken) {
    return await fetch(`${this.localPath}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  /**
   * to get public user data without accessToken
   * @param {Array} ids - array of ids of wanted users 
   */
  async getByIds(ids) {
    return await fetch(`${this.localPath}/${ids.join(',')}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async update(accessToken, body) {
    return await fetch(`${this.localPath}`, {
      method: "POST",
      /**
       * body: {
          username,
          avatar,
          twitter: {
            twitterAuthCode, codeChallenge
          },
          discord: {
            discordAuthCode
          },
          google: {
            token
          }
        },
       */
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async delete(accessToken) {
    return await fetch(`${this.localPath}`, {
      method: "DELETE",
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
class Wallet {
  constructor(path) {
    this.localPath = `${path}/users`;
  }

  async connect({
    blockchain,
    walletAddress,
    signatureId,
    signature,
    signatureType,
    accessToken,
    userId
  }) {
    return await fetch(`${this.localPath}/${userId}/wallets`, {
      method: "POST",
      body: JSON.stringify({
        blockchain,
        walletAddress,
        signatureId,
        signature,
        signatureType
      }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async disconnect({
    id,
    accessToken,
    userId
  }) {
    return await fetch(`${this.localPath}/${userId}/wallets/${id}`, {
      method: "DELETE",
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async get({ accessToken, userId }) {
    return await fetch(`${this.localPath}/${userId}/wallets`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async getNFTs({ accessToken, userId, id }) {
    return await fetch(`${this.localPath}/${userId}/wallets/${id}/nfts`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}
class Chess {
  constructor(path) {
    this.localPath = `${path}/games`;
  }

  async find_create({ mode, color, everyoneCanJoin, accessToken }) {
    console.log(mode, color)
    return await fetch(`${this.localPath}/init`, {
      method: "POST",
      body: JSON.stringify({
        mode, color,
        everyoneCanJoin
      }),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async get({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async join({ id, accessToken }) {
    return await fetch(`${this.localPath}/${id}/join`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async move({ id, move, accessToken }) {
    return await fetch(`${this.localPath}/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ move }),
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'content-type': 'application/json'
      }
    });
  }
}
class Lobby {
  constructor(path) {
    this.localPath = `${path}/lobby`;
  }

  async get(accessToken) {
    return await fetch(`${this.localPath}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      API() {
        let env = useRuntimeConfig();
        let path = env.public.API_URL || "https://api-dev.thechess.io";

        return {
          Auth: {
            Discord: new Discord(`${path}/auth/api/v1/auth`),
            Twitter: new Twitter(`${path}/auth/api/v1/auth`),
            Google: new Google(`${path}/auth/api/v1/auth`)
          },
          User: new User(`${path}/auth/api/v1`),
          Wallet: new Wallet(`${path}/auth/api/v1`),
          Signatures: new Signatures(`${path}/auth/api/v1`),
          Chess: new Chess(`${path}/game/api/v1`),
          Lobby: new Lobby(`${path}/game/api/v1`)
        }
      }
    }
  }
})