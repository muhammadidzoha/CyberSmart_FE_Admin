import {
  Button,
  Card,
  CardBody,
  Dialog,
  Input,
  DialogBody,
  DialogHeader,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import Table from "../../components/Table/Table";
import ReactPaginate from "react-paginate";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import useSWR from "swr";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { format } from "date-fns";

const columnData = ({ mutate }) => [
  {
    accessorKey: "",
    header: "NO",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.row.index + 1}
      </Typography>
    ),
  },
  {
    accessorKey: "title",
    header: "JUDUL",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "date_of_publication",
    header: "PUBLIKASI",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {format(new Date(props.getValue()), "dd MMMM yyyy")}
      </Typography>
    ),
  },
  {
    accessorKey: "apbd_file",
    header: "BERKAS",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue().split("/").pop()}
      </Typography>
    ),
  },
  {
    accessorKey: "",
    header: "AKSI",
    cell: (props) => {
      const [open, setOpen] = useState(false);
      const [currentTransparencytId, setCurrentTransparencytId] = useState();

      const handleOpen = () => {
        setOpen(!open);
      };

      const handleClose = () => {
        setOpen(false);
      };

      const handleDelete = async (transparency_id) => {
        await axios.delete(
          `http://localhost:5000/api/transparency/delete/${transparency_id}`
        );
        mutate("transparencys");
      };

      const onSubmit = async (values) => {
        const formDataToSend = new FormData();
        formDataToSend.append("title", values.title);
        formDataToSend.append("date_of_publication", values.date.startDate);
        formDataToSend.append("apbd", values.apbd);

        try {
          const response = await axios.patch(
            `http://localhost:5000/api/transparency/update/${currentTransparencytId}`,
            formDataToSend,
            {
              headers: {
                "Content-type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );

          const successMessage = response.data.msg;

          toast.success(successMessage, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          mutate("transparencys");
          handleClose();
        } catch (error) {
          handleClose();
          toast.error(error.response.data.msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      };

      const {
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setValues,
      } = useFormik({
        initialValues: {
          title: "",
          date: {
            startDate: null,
          },
          apbd: null,
        },
        onSubmit,
      });

      const handleFile = (e) => {
        const image = e.target.files[0];
        setFieldValue("apbd", image);
      };

      const handleEdit = async (transparency_id) => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/transparency/${transparency_id}`
          );
          const transparencyData = response.data;

          console.log(transparencyData);

          setValues({
            title: transparencyData.title,
            date: {
              startDate: transparencyData.date_of_publication,
            },
            announcement: transparencyData.apbd_file,
          });

          setCurrentTransparencytId(transparency_id);

          handleOpen();
        } catch (error) {
          console.error("Error fetching transparency data:", error);
        }
      };

      const handleDateEditSelect = (selectedDate) => {
        const formattedDate = selectedDate;
        setFieldValue("date", formattedDate);
      };

      const [formattedDate, setFormattedDate] = useState("");

      const initialDate = new Date(values.date.startDate);

      useEffect(() => {
        const formattedDateString = initialDate.toLocaleDateString("id", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        setFormattedDate(formattedDateString);
      }, [initialDate]);

      return (
        <div className="flex justify-center items-center">
          <Dialog open={open} handler={handleOpen}>
            <DialogHeader>
              <Typography variant="h4" color="gray">
                Edit Transparansi
              </Typography>
            </DialogHeader>
            <DialogBody>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-5">
                  <Textarea
                    label="Title"
                    id="title"
                    name="title"
                    value={values.title}
                    color="deep-purple"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Datepicker
                    inputName="date"
                    inputId="date"
                    containerClassName="relative border border-blue-gray-200 rounded-[7px] transition-all"
                    inputClassName="relative transition-all duration-300 py-2.5 pl-3 pr-14 w-full border-blue-gray-200 rounded-md font-normal text-sm text-blue-gray-700 placeholder-blue-gray-700 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-0"
                    i18n="id"
                    value={values.date.startDate}
                    useRange={false}
                    asSingle={true}
                    placeholder={formattedDate}
                    toggleClassName="absolute right-0 h-full px-2 text-blue-gray-500 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                    onChange={handleDateEditSelect}
                    displayFormat="DD MMMM YYYY"
                  />
                  <input
                    type="file"
                    name="apbd"
                    id="apbd"
                    onChange={handleFile}
                    onBlur={handleBlur}
                    className="border border-gray-400 rounded-md p-1"
                  />
                </div>
                <div className="flex mt-5 justify-end">
                  <Button
                    variant="text"
                    color="red"
                    onClick={handleOpen}
                    className="mr-1"
                  >
                    <span>Cancel</span>
                  </Button>
                  <Button type="submit" variant="gradient" color="deep-purple">
                    <span>Confirm</span>
                  </Button>
                </div>
              </form>
            </DialogBody>
          </Dialog>
          <Button
            size="sm"
            variant="text"
            color="deep-purple"
            onClick={() => handleEdit(props.row.original.transparency_id)}
          >
            Ubah
          </Button>
          <Button
            size="sm"
            variant="text"
            color="deep-purple"
            onClick={() => handleDelete(props.row.original.transparency_id)}
          >
            Hapus
          </Button>
        </div>
      );
    },
  },
];

const Keuangan = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(9);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [expire, setExpire] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    reToken();
  }, []);

  const reToken = async () => {
    try {
      const response = await axiosJWT.get(
        "http://localhost:5000/api/auth/retoken",
        {
          withCredentials: true,
        }
      );
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      console.log(error.response);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(
          "http://localhost:5000/api/auth/retoken",
          {
            withCredentials: true,
          }
        );
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const fetcher = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/transparencys?search_query=${keyword}&page=${page}&limit=${limit}`
    );

    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    return response.data;
  };

  useEffect(() => {
    mutate();
  }, [page, keyword, pages, rows]);

  const onSubmit = async (values) => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", values.title);
    formDataToSend.append("date_of_publication", values.date.startDate);
    formDataToSend.append("apbd", values.apbd);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/transparency/create",
        formDataToSend,
        {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const successMessage = response.data.msg;

      toast.success(successMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      mutate("transparencys");
      handleClose();

      setValues({
        title: "",
        date: {
          startDate: null,
        },
        apbd: null,
      });
    } catch (error) {
      handleClose();
      toast.error(error.response.data.msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      title: "",
      date: {
        startDate: null,
      },
      apbd: null,
    },
    onSubmit,
  });

  console.log(values);

  const { data, mutate } = useSWR(["transparencys", keyword], fetcher);

  if (!data) return <div>Loading...</div>;

  const handleOpen = () => {
    reToken();
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    setFieldValue("apbd", image);
  };

  const handleSearch = (e) => {
    setQuery(e);
  };

  const submitSearch = () => {
    setPage(0);
    setKeyword(query);
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  const handleDateSelect = (selectedDate) => {
    const formattedDate = selectedDate;
    setFieldValue("date", formattedDate);
  };

  const columns = columnData({ mutate });

  return (
    <div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          <Typography variant="h4" color="gray">
            Tambah Transparansi
          </Typography>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-5">
              <Textarea
                label="Judul"
                id="title"
                name="title"
                color="deep-purple"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Datepicker
                inputName="date"
                inputId="date"
                containerClassName="relative border border-blue-gray-200 rounded-[7px] transition-all"
                inputClassName="relative transition-all duration-300 py-2.5 pl-3 pr-14 w-full border-blue-gray-200 rounded-md font-normal text-sm text-blue-gray-700 placeholder-blue-gray-700 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-0"
                i18n="id"
                value={values.date}
                useRange={false}
                asSingle={true}
                placeholder="Tanggal"
                toggleClassName="absolute right-0 h-full px-2 text-blue-gray-500 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                onChange={handleDateSelect}
                displayFormat="DD MMMM YYYY"
              />
              <input
                type="file"
                name="apbd"
                id="apbd"
                onChange={handleFileChange}
                onBlur={handleBlur}
                className="border border-gray-400 rounded-md p-1"
              />
            </div>
            <div className="flex mt-5 justify-end">
              <Button
                variant="text"
                color="red"
                onClick={handleOpen}
                className="mr-1"
              >
                <span>Cancel</span>
              </Button>
              <Button type="submit" variant="gradient" color="deep-purple">
                <span>Confirm</span>
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
      {/* <NewsWidget totalRows={rows} /> */}
      <div className="mt-4">
        <Card>
          <CardBody>
            <div className="flex justify-between">
              <div>
                <form
                  onSubmit={submitSearch}
                  className="relative flex w-full max-w-[24rem]"
                >
                  <Input
                    label="Cari berdasarkan Judul"
                    name="query"
                    color="deep-purple"
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pr-20"
                    containerProps={{
                      className: "min-w-0",
                    }}
                  />
                  <Button
                    size="sm"
                    type="submit"
                    variant="gradient"
                    color="deep-purple"
                    className="!absolute right-1 top-1 rounded"
                  >
                    Cari
                  </Button>
                </form>
              </div>
              <Button
                onClick={handleOpen}
                variant="gradient"
                color="deep-purple"
              >
                Tambah Laporan APB DESA
              </Button>
            </div>
            <div className="mt-5">
              <Table columnsData={columns} tableData={data.results} />
              <div className="my-5 flex justify-between">
                <Typography variant="small" color="gray">
                  Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
                </Typography>
                <div key={rows}>
                  <ReactPaginate
                    nextLabel={
                      <Typography
                        variant="small"
                        color="gray"
                        className="flex items-center font-medium"
                      >
                        Next
                        <BsArrowRightShort className="w-6 h-6" />
                      </Typography>
                    }
                    previousLabel={
                      <Typography
                        variant="small"
                        color="gray"
                        className="flex items-center font-medium"
                      >
                        <BsArrowLeftShort className="w-6 h-6" />
                        Prev
                      </Typography>
                    }
                    nextClassName="hover:bg-gray-900/10 px-4 py-2 rounded-lg"
                    previousClassName="hover:bg-gray-900/10 px-4 py-2 rounded-lg"
                    pageCount={Math.min(10, data.totalPage)}
                    onPageChange={handlePageChange}
                    containerClassName="flex items-center space-x-2 text-navy-800 text-sm font-medium"
                    pageLinkClassName="text-navy-800 px-4 py-2 rounded-lg hover:bg-gray-900/10"
                    activeLinkClassName="bg-brand-500 text-white"
                    disabledLinkClassName="font-thin"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Keuangan;
