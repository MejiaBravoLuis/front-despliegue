import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://bancopenguin-backend-production.up.railway.app/BancoPenguin/v1/',
  timeout: 5000
});

apiClient.interceptors.request.use(
  (config) => {
    const useUserDetails = localStorage.getItem('user');

    if (useUserDetails) {
      const token = JSON.parse(useUserDetails).token;
      config.headers['x-token'] = token; 
    }

    return config;
  },
  (e) => {
    return Promise.reject(e);
  }
);

export const login = async (data) => {
  try {
    return await apiClient.post('auth/login', data);
  } catch (e) {
    return { error: true, e };
  }
};

export const register = async (data) => {
  try {
    return await apiClient.post('auth/register', data);
  } catch (e) {
    return { error: true, e };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('user/me');
    return response.data;
  } catch (e) {
    console.error("Error al obtener el perfil del usuario:", e);
    return { error: true, e };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('user/');
    return { data: response.data, error: false };
  } catch (e) {
    console.error("Error al obtener los usuarios:", e);
    return { data: null, error: true, e };
  }
};

export const forgotPassword = async (email) => {
  try {
    return await apiClient.post("user/forgot-password", { email });
  } catch (e) {
    return { error: true, e };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    return await apiClient.post(`user/reset-password/${token}`, { password: newPassword });
  } catch (e) {
    return { error: true, e };
  }
};

export const getPendingUsers = async () => {
  try {
    const response = await apiClient.get('user/pending');
    return { data: response.data.users, error: false };
  } catch (e) {
    console.error("Error al obtener usuarios pendientes:", e);
    return { data: null, error: true, e };
  }
};

export const deleteUserByAdmin = async (id) => {
  console.log(id)
  try {
    const response = await apiClient.delete(`user/${id}`);
    return { data: response.data, error: false };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return {
      data: null,
      error: true,
      msg: error.response?.data?.msg || "Error al eliminar usuario",
    };
  }
};

export const updateUserByAdmin = async (id, data) => {
  try {
    const response = await apiClient.put(`user/${id}`, data); 
    return { data: response.data, error: false };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return {
      data: null,
      error: true,
      msg: error.response?.data?.msg || "Error al actualizar el usuario",
    };
  }
};

export const acceptUser = async (userId) => {
  try {
    const response = await apiClient.put(`user/aceptar/${userId}`);
    return { data: response.data, error: false };
  } catch (e) {
    console.error("Error al aceptar usuario:", e);
    return { data: null, error: true, e };
  }
};

export const getMyAccounts = async () => {
  try {
    const response = await apiClient.get("account/mias");
    return response.data.cuentas || []; 
  } catch (e) {
    console.error("Error al obtener las cuentas:", e);
    return [];
  }
};


export const createDeposit = async (fromAccount, toAccount, amount, description = "") => {
  try {
    const response = await apiClient.post('movement/crear', {
      fromAccount,
      toAccount,
      amount,
      description
    });
    return response.data;
  } catch (e) {
    console.error("Error al crear el depósito:", e);
    throw e;
  }
};

export const getMyMovements = async () => {
  try {
    const response = await apiClient.get('movement/mios');
    return response.data || [];
  } catch (e) {
    console.error("Error al obtener movimientos del usuario:", e);
    return [];
  }
};

export const getAllActiveMovements = async () => {
  try {
    const response = await apiClient.get('movement/activos');
    return response.data;
  } catch (e) {
    console.error("Error al obtener movimientos activos:", e);
    return [];
  }
};

export const getAllCanceledMovements = async () => {
  try {
    const response = await apiClient.get('movement/cancelados');
    return response.data;
  } catch (e) {
    console.error("Error al obtener movimientos cancelados:", e);
    return [];
  }
};
export const cancelMovement = async (id) => {
  try {
    const response = await apiClient.put(`movement/cancelar/${id}`);
    return response.data;
  } catch (e) {
    console.error("Error al cancelar el movimiento:", e);
    throw e;
  }
};

export const updateProfile = async (data) => {
  try{
    return await apiClient.put("user/me", data); 
  }catch (e) {
    return { error: true, e };
  }
};

export const createPrize = async (data) => {
  try {
    return await apiClient.post('prize/', data);
  } catch (e) {
    return { error: true, msg: e?.response?.data?.message || "Error al crear premio", e };
  }
};

export const editPrize = async (id, data) => {
  try {
    return await apiClient.put(`prize/${id}`, data);
  } catch (e) {
    return { error: true, msg: e?.response?.data?.message || "Error al editar premio", e };
  }
};

export const getAllPrizes = async () => {
  try {
    const response = await apiClient.get('prize/prizes');
    return response;
  } catch (error) {
    return { error: true, msg: "Error al obtener premios", e: error };
  }
};

export const claimPrize = async (prizeId, numeroCuenta) => {
  try {
    const response = await apiClient.post('redemption/canjear', {
      prizeId,
      numeroCuenta
    });
    return { data: response.data, error: false };
  } catch (error) {
    console.error("Error al reclamar premio:", error);
    return {
      data: null,
      error: true,
      msg: error.response?.data?.msg || "No se pudo reclamar el premio",
    };
  }
};

export const eliminarPrize = async (prizeId) => {
  try {
    const response = await apiClient.delete(`prize/${prizeId}`);
    return { data: response.data, error: false };
  } catch (error) {
    console.error("Error al eliminar premio:", error);
    return {
      data: null,
      error: true,
      msg: error.response?.data?.message || "Error al eliminar premio",
    };
  }
};

export const createAccount = async (tipoCuenta) => {
  try {
    const response = await apiClient.post('account/solicitar', { tipoCuenta });
    return { data: response.data, error: false };
  } catch (error) {
    console.error("Error al crear cuenta:", error);
    return {
      data: null,
      error: true,
      msg: error.response?.data?.message || "Error al crear cuenta",
    };
  }
};

export const getPendingAccounts = async () => {
  try {
    const response = await apiClient.get('account/pendientes');
    return { data: response.data.cuentas || [], error: false };
  } catch (error) {
    console.error("Error al obtener cuentas pendientes:", error);
    return {
      data: [],
      error: true,
      msg: error.response?.data?.message || "Error al obtener cuentas pendientes",
    };
  }
};

export const getActiveAccounts = async () => {
  try {
    const response = await apiClient.get('account/activas');
    return { data: response.data.cuentas || [], error: false };
  } catch (error) {
    console.error("Error al obtener cuentas activas:", error);
    return {
      data: [],
      error: true,
      msg: error.response?.data?.message || "Error al obtener cuentas activas",
    };
  }
};

export const acceptAccount = async (id) => {
  try {
    const response = await apiClient.put(`account/aceptar/${id}`);
    return { data: response.data, error: false };
  } catch (error) {
    console.error("Error al aceptar cuenta:", error);
    return {
      data: null,
      error: true,
      msg: error.response?.data?.message || "Error al aceptar cuenta",
    };
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await apiClient.put(`account/desactivar/${id}`);
    return { data: response.data, error: false };
  } catch (error) {
    console.error("Error al desactivar cuenta:", error);
    return {
      data: null,
      error: true,
      msg: error.response?.data?.message || "Error al desactivar cuenta",
    };
  }
};

export const getRedemptions = async () => {
  try {
    const response = await apiClient.get("redemption/");  
    return response.data;
  } catch (error) {
    console.error("Error al obtener los canjes:", error);
    return { error: true, msg: "Error al obtener canjes" };
  }
};

export const agregarAFavoritos = async (numeroCuenta, alias) => {
  try {
    const response = await apiClient.post("favorite", { numeroCuenta, alias });
    return { data: response.data, error: false };
  } catch (error) {
    console.error("Error al agregar a favoritos:", error);
    return {
      data: null,
      error: true,
      msg: error.response?.data?.message || "No se pudo agregar a favoritos",
    };
  }
};

export const eliminarDeFavoritos = async (favoritoId) => {
  try {
    const response = await apiClient.delete(`favorite/${favoritoId}`);
    return { data: response.data, error: false };
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    return {
      data: null,
      error: true,
      msg: error.response?.data?.message || "No se pudo eliminar de favoritos",
    };
  }
};

export const listarFavoritos = async () => {
  try {
    const response = await apiClient.get("favorite");
    return { data: response.data.favoritos, error: false };
  } catch (error) {
    console.error("Error al listar favoritos:", error);
    return {
      data: [],
      error: true,
      msg: error.response?.data?.message || "Error al obtener favoritos",
    };
  }
};

export const agregarSaldoCuenta = async (accountId, monto) => {
  try {
    const response = await apiClient.put(`account/agregar-saldo/${accountId}`, { monto });
    return { data: response.data, error: false };
  } catch (error) {
    console.error("Error al agregar saldo a la cuenta:", error);
    return {
      data: null,
      error: true,
      msg: error.response?.data?.message || "Error al agregar saldo",
    };
  }
};










