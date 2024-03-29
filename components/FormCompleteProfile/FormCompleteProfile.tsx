"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import apiCompleteProfile from "@/api/complete-profile";
import { Department, Departments } from "@/interfaces/profile";
import Loading from "@/components/loading/index";

interface FormData {
  code: number;
  department_id: number;
  center: string;
}
interface ValueDepartment {
  value: number;
  label: string;
}

interface PropsSubmit {
  handleForm: (value: any) => void;
}

export default function FormCompleteProfile({ handleForm }: PropsSubmit) {
  const [optionDepartment, setOptionDepartment] = useState<ValueDepartment[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup
    .object({
      code: yup
        .number()
        .typeError("ID nhân viên không được để trống")
        .min(2, "ID nhân viên phải lớn hơn 2 kí tự")
        .moreThan(9, "ID nhân viên phải lớn hơn 2 kí tự")
        .integer("ID nhân viên phải là số nguyên")
        .required(),
      department_id: yup.number().positive().integer().required(),
      center: yup.string().required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    getDepartment();
    setValue("department_id", 1);
  }, []);

  const onSubmit = (data: FormData) => {
    handleForm(data);
  };

  const getDepartment = async () => {
    try {
      setIsLoading(true);
      const departments = await apiCompleteProfile.getDepartMent();
      if (departments) {
        optionSelect(departments?.data?.departments);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const optionSelect = (departments: any) => {
    const result = departments.map((value: Department) => {
      return {
        value: value.id,
        label: value.name,
      };
    });
    setOptionDepartment(result);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col pb-12 pt-8 px-5 sm:px-10 border rounded-lg bg-[#FAFAFA] w-[380px] sm:w-[460px] mx-auto max-w-screen-xl shadow-lg"
      >
        <div className="flex justify-start text-[#00C853] font-bold text-xl sm:text-xl mb-8">
          Nhập thông tin cá nhân
        </div>
        <div className="flex flex-col mb-4 sm:mb-8">
          <label className="text-sm sm:text-md font-bold">ID nhân viên</label>
          <input
            className="outline-none p1 sm:p-2 border mt-2 text-sm sm:text-md"
            type="number"
            placeholder="ID nhân viên"
            {...register("code")}
          />
          {errors.code && (
            <span className="text-[red]">{errors.code?.message}</span>
          )}
        </div>
        <div className="flex flex-col mb-4 sm:mb-8">
          <label className="text-sm sm:text-md font-bold">
            Tòa nhà làm việc
          </label>
          <select
            {...register("department_id")}
            className="outline-none p-2 border mt-2"
          >
            {Array.isArray(optionDepartment) &&
              optionDepartment.map((value, index) => {
                return (
                  <option value={value?.value} key={index}>
                    {value?.label}
                  </option>
                );
              })}
          </select>
          {errors.department_id && (
            <span className="text-[red]">{errors.department_id?.message}</span>
          )}
        </div>
        <div className="flex flex-col mb-8 sm:mb-16">
          <label className="text-sm sm:text-md font-bold">
            Bộ phận làm việc
          </label>
          <select
            {...register("center")}
            className="outline-none p-2 border mt-2"
          >
            <option value="DU10">DU10</option>
            <option value="DU11">DU11</option>
            <option value="DU12">DU12</option>
            <option value="SALE">SALE</option>
            <option value="SAMURAI">SAMURAI</option>
          </select>
          {errors.center && (
            <span className="text-[red]">{errors.center?.message}</span>
          )}
        </div>
        <input
          type="submit"
          value="Gửi"
          className="p-2 border text-[white] bg-[#66a166] hover:bg-[green] cursor-pointer"
        />
      </form>
      {isLoading && <Loading />}
    </div>
  );
}
