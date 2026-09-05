import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


export const scanFolder = async (path) => {
  const response = await api.post("/organizer/scan", {
    path: path,
  });

  return response.data;
};


export const organizeFolder = async (path) => {
  const response = await api.post("/organizer/organize", {
    path: path,
  });

  return response.data;
};


export default api;

export const findDuplicates = async (path) => {
  const response = await api.post("/organizer/duplicates", {
    path: path,
  });

  return response.data;
};
export const getDuplicatePreview = async (path) => {
  const response = await api.post("/organizer/duplicate-preview", {
    path: path,
  });

  return response.data;
};

export const moveDuplicate = async (path) => {
  const response = await api.post("/organizer/move-duplicate", {
    path: path,
  });

  return response.data;
};
export const getActivity = async () => {
  const response = await api.get("/organizer/activity");
  return response.data;
};
export const getDatePreview = async (path) => {
  const response = await api.post("/organizer/date-preview", {
    path: path,
  });

  return response.data;
};

export const organizeByDate = async (path) => {
  const response = await api.post("/organizer/organize-by-date", {
    path: path,
  });

  return response.data;
};
export const addRule = async (extension, category) => {
  const response = await api.post("/organizer/rules", null, {
    params: {
      extension: extension,
      category: category,
    },
  });

  return response.data;
};

export const getRules = async () => {
  const response = await api.get("/organizer/rules");

  return response.data;
};

export const deleteRule = async (extension) => {
  const response = await api.delete("/organizer/rules", {
    params: {
      extension: extension,
    },
  });

  return response.data;
};
export const undoLastAction = async () => {
  const response = await api.post("/organizer/undo");

  return response.data;
};
export const getProtectedFolders = async () => {
  const response = await api.get("/organizer/protected-folders");
  return response.data;
};

export const addProtectedFolder = async (path) => {
  const response = await api.post(
    "/organizer/protected-folders",
    null,
    {
      params: {
        path: path,
      },
    }
  );

  return response.data;
};
export const removeProtectedFolder = async (path) => {
  const response = await api.delete(
    "/organizer/protected-folders",
    {
      params: {
        path,
      },
    }
  );

  return response.data;
};