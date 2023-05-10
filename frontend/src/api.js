export const API_URL = process.env.REACT_APP_API_URL;

export function TOKEN_POST(body) {
  return {
    url: API_URL + "/auth/signin",
    options: {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
}

export function TOKEN_GET() {
  return {
    url: API_URL + "/auth/token",
    options: {
      method: "GET",
      credentials: "include",
    },
  };
}
export function USER_GET() {
  return {
    url: API_URL + "/v1/auth/validate",
    options: {
      method: "GET",
      credentials: "include",
    },
  };
}

export function USER_POST(body) {
  return {
    url: API_URL + "/auth/signup",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  };
}
