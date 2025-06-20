import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useRegister } from "../shared/hooks";
import { useNavigate } from "react-router-dom";

import iconUser from "../assets/icons/4.png";
import iconEmail from "../assets/icons/3.png";
import iconPassword from "../assets/icons/5.png";
import iconFone from "../assets/icons/6.png";
import iconCasita from "../assets/icons/7.png";
import iconMonny from "../assets/icons/8.png";
import iconPala from "../assets/icons/10.png";
import iconCUI from "../assets/icons/11.png";

const registerSchema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio"),
  username: yup.string().required("El username es obligatorio"),
  dpi: yup.string().required("El DPI es obligatorio"),
  direccion: yup.string().required("La dirección es obligatoria"),
  telefono: yup.string().required("El teléfono es obligatorio"),
  email: yup.string().email("Debe ser un email válido").required("El email es obligatorio"),
  password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
  nombreTrabajo: yup.string().required("El nombre del trabajo es obligatorio"),
  montoMensual: yup
    .number()
    .typeError("El monto mensual debe ser un número")
    .min(100, "Los ingresos mensuales deben ser al menos Q100")
    .required("Los ingresos mensuales son obligatorios"),
  tipoCuenta: yup
  .string()
  .oneOf(["AHORRO", "MONETARIA"], "Tipo de cuenta inválido")
  .required("El tipo de cuenta es obligatorio"),
});

export const Register = () => {
  const { register: registerUser, isLoading } = useRegister();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        username: data.username,
        dpi: data.dpi,
        direccion: data.direccion,
        telefono: data.telefono,
        email: data.email,
        password: data.password,
        nombreTrabajo: data.nombreTrabajo,
        montoMensual: data.montoMensual,
        tipoCuenta: data.tipoCuenta,
      });
      toast.success("Usuario registrado exitosamente");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Ya existe una cuenta con ese correo electrónico");
      } else {
        toast.error("Error al registrar. Intenta de nuevo.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Registrarse</h2>

      <div className="container-input">
        <img src={iconUser} alt="icono nombre" className="input-icon" />
        <input type="text" placeholder="Nombre" {...register("name")} />
      </div>
      {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}

      <div className="container-input">
        <img src={iconUser} alt="icono username" className="input-icon" />
        <input type="text" placeholder="Username" {...register("username")} />
      </div>
      {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}

      <div className="container-input">
        <img src={iconCUI} alt="icono dpi" className="input-icon" />
        <input type="text" placeholder="DPI" {...register("dpi")} />
      </div>
      {errors.dpi && <p style={{ color: "red" }}>{errors.dpi.message}</p>}

      <div className="container-input">
        <img src={iconCasita} alt="icono dirección" className="input-icon" />
        <input type="text" placeholder="Dirección" {...register("direccion")} />
      </div>
      {errors.direccion && <p style={{ color: "red" }}>{errors.direccion.message}</p>}

      <div className="container-input">
        <img src={iconFone} alt="icono teléfono" className="input-icon" />
        <input type="text" placeholder="Teléfono" {...register("telefono")} />
      </div>
      {errors.telefono && <p style={{ color: "red" }}>{errors.telefono.message}</p>}

      <div className="container-input">
        <img src={iconEmail} alt="icono email" className="input-icon" />
        <input type="text" placeholder="Email" {...register("email")} />
      </div>
      {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

      <div className="container-input">
        <img src={iconPassword} alt="icono password" className="input-icon" />
        <input type="password" placeholder="Password" {...register("password")} />
      </div>
      {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

      <div className="container-input">
        <img src={iconPala} alt="icono nombre trabajo" className="input-icon" />
        <input type="text" placeholder="Nombre del trabajo" {...register("nombreTrabajo")} />
      </div>
      {errors.nombreTrabajo && <p style={{ color: "red" }}>{errors.nombreTrabajo.message}</p>}

      <div className="container-input">
        <img src={iconMonny} alt="icono monto mensual" className="input-icon" />
        <input
          type="number"
          placeholder="Ingresos mensuales (Q)"
          {...register("montoMensual")}
        />
      </div>
      {errors.montoMensual && <p style={{ color: "red" }}>{errors.montoMensual.message}</p>}

      <div className="container-input">
      <label htmlFor="tipoCuenta" className="select-label">Tipo de cuenta</label>
      <div className="custom-select-wrapper">
          <select id="tipoCuenta" {...register("tipoCuenta")} className="custom-select">
            <option value="">Selecciona una opción</option>
            <option value="AHORRO">Ahorro</option>
            <option value="MONETARIA">Monetaria</option>
          </select>
        </div>
      </div>
{errors.tipoCuenta && <p style={{ color: "red" }}>{errors.tipoCuenta.message}</p>}



      <button type="submit" className="button" disabled={isLoading}>
        {isLoading ? "Cargando...." : "REGISTRARSE"}
      </button>
    </form>
  );
};
