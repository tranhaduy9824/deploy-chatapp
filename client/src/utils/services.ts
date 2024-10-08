export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (
  url: string,
  body: string | object | FormData,
  setProgress?: (value: number) => void | undefined,
  token: boolean = false,
  formData: boolean = false
) => {
  try {
    if (setProgress) setProgress(20);

    const headers: HeadersInit = {};

    if (!formData) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      const userItem = localStorage.getItem("User");
      const user = userItem ? JSON.parse(userItem) : null;
      const userToken = user?.token;

      if (userToken) {
        headers["Authorization"] = `Bearer ${userToken}`;
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData ? (body as FormData) : JSON.stringify(body),
    });

    if (setProgress) setProgress(60);
    const data = await response.json();
    if (setProgress) setProgress(100);

    if (!response.ok) {
      let message;

      if (setProgress) {
        setTimeout(() => {
          setProgress(-1);
        }, 800);
      }

      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }

      return { error: true, message };
    }

    if (setProgress) {
      setTimeout(() => {
        setProgress(-1);
      }, 800);
    }
    return data;
  } catch (error) {
    if (setProgress) setProgress(0);
    console.error("Error during post request:", error);
    return { error: true, message: "An unexpected error occurred" };
  }
};

export const getRequest = async (
  url: string,
  setProgress?: (value: number) => void,
  token: boolean = false
) => {
  try {
    if (setProgress) setProgress(20);

    const headers: HeadersInit = {};

    if (token) {
      const userItem = localStorage.getItem("User");
      const user = userItem ? JSON.parse(userItem) : null;
      const userToken = user?.token;

      if (userToken) {
        headers["Authorization"] = `Bearer ${userToken}`;
      }
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (setProgress) setProgress(60);

    const data = await response.json();
    if (setProgress) setProgress(100);

    if (!response.ok) {
      let message;

      if (setProgress) {
        setTimeout(() => {
          setProgress(-1);
        }, 800);
      }

      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }

      return { error: true, message };
    }

    if (setProgress) {
      setTimeout(() => {
        setProgress(-1);
      }, 800);
    }
    return data;
  } catch (error) {
    if (setProgress) setProgress(0);
    console.error("Error during get request:", error);
    return { error: true, message: "An unexpected error occurred" };
  }
};

export const patchRequest = async (
  url: string,
  body: string | object,
  setProgress?: (value: number) => void | undefined,
  token: boolean = false,
  formData: boolean = false
) => {
  try {
    if (setProgress) setProgress(20);

    const headers: HeadersInit = formData
      ? {}
      : { "Content-Type": "application/json" };

    if (token) {
      const userItem = localStorage.getItem("User");
      const user = userItem ? JSON.parse(userItem) : null;
      const userToken = user?.token;

      if (userToken) {
        headers["Authorization"] = `Bearer ${userToken}`;
      }
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: formData ? (body as FormData) : JSON.stringify(body),
    });

    if (setProgress) setProgress(60);
    const data = await response.json();
    if (setProgress) setProgress(100);

    if (!response.ok) {
      let message;

      if (setProgress) {
        setTimeout(() => {
          setProgress(-1);
        }, 800);
      }

      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }

      return { error: true, message };
    }

    if (setProgress) {
      setTimeout(() => {
        setProgress(-1);
      }, 800);
    }
    return data;
  } catch (error) {
    if (setProgress) setProgress(0);
    console.error("Error during patch request:", error);
    return { error: true, message: "An unexpected error occurred" };
  }
};

export const deleteRequest = async (
  url: string,
  setProgress?: (value: number) => void,
  token: boolean = false
) => {
  try {
    if (setProgress) setProgress(20);

    const headers: HeadersInit = {};

    if (token) {
      const userItem = localStorage.getItem("User");
      const user = userItem ? JSON.parse(userItem) : null;
      const userToken = user?.token;

      if (userToken) {
        headers["Authorization"] = `Bearer ${userToken}`;
      }
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (setProgress) setProgress(60);

    const data = await response.json();
    if (setProgress) setProgress(100);

    if (!response.ok) {
      let message;

      if (setProgress) {
        setTimeout(() => {
          setProgress(-1);
        }, 800);
      }

      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }

      return { error: true, message };
    }

    if (setProgress) {
      setTimeout(() => {
        setProgress(-1);
      }, 800);
    }
    return data;
  } catch (error) {
    if (setProgress) setProgress(0);
    console.error("Error during delete request:", error);
    return { error: true, message: "An unexpected error occurred" };
  }
};