import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Table from "../../components/Table/Table";
import axios from "axios";
import useSWR from "swr";
import { MdFileUpload, MdTrackChanges } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import ReactPaginate from "react-paginate";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { toast } from "react-toastify";
import NewsWidget from "./component/News/NewsWidget";

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
    accessorKey: "description",
    header: "DESKRIPSI",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "content",
    header: "KONTEN",
    cell: (props) => (
      <Typography
        variant="small"
        color="gray"
        className="truncate 2xl:max-w-52 3xl:max-w-72"
      >
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "urlToThumbnail",
    header: "GAMBAR",
    cell: (props) => (
      <img
        src={props.getValue()}
        alt=""
        className="w-[100px] h-[100px] object-cover object-center"
      />
    ),
  },
  {
    accessorKey: "source",
    header: "SUMBER",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "views",
    header: "DILIHAT",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "",
    header: "AKSI",
    cell: (props) => {
      const [open, setOpen] = useState(false);
      const [preview, setPreview] = useState("");

      const handleOpen = () => {
        setOpen(!open);
      };

      const handleClose = () => {
        setOpen(false);
        setPreview("");
      };

      const handleDelete = async (news_id) => {
        await axios.delete(`http://localhost:5000/api/news/delete/${news_id}`);
        mutate("news");
      };

      const onSubmit = async (values) => {
        const formDataToSend = new FormData();
        formDataToSend.append("title", values.title);
        formDataToSend.append("description", values.description);
        formDataToSend.append("content", values.content);
        formDataToSend.append("thumbnail", values.thumbnail);
        formDataToSend.append("source", values.source);
        try {
          const response = await axios.patch(
            `http://localhost:5000/api/news/update/${currentNewsId}`,
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

          mutate("news");
          handleClose();

          setValues({
            title: "",
            description: "",
            content: "",
            thumbnail: null,
            source: "",
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

      const [currentNewsId, setCurrentNewsId] = useState(null);

      const {
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        setValues,
        setFieldValue,
      } = useFormik({
        initialValues: {
          title: "",
          description: "",
          content: "",
          source: "",
          thumbnail: null,
        },
        onSubmit,
      });

      const handleFile = (e) => {
        const image = e.target.files[0];
        setPreview(URL.createObjectURL(image));
        setFieldValue("thumbnail", image);
      };

      const handleEdit = async (news_id) => {
        try {
          console.log(props.row.original);

          setValues({
            title: props.row.original.title,
            content: props.row.original.content,
            description: props.row.original.description,
            source: props.row.original.source,
          });

          setPreview(props.row.original.urlToThumbnail);
          setCurrentNewsId(news_id);

          handleOpen();
        } catch (error) {
          console.error("Error fetching news data:", error);
        }
      };

      return (
        <div className="flex justify-center">
          <Dialog open={open} handler={handleOpen}>
            <DialogHeader>
              <Typography variant="h4" color="gray">
                Edit Berita
              </Typography>
            </DialogHeader>
            <DialogBody>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-5">
                  <Textarea
                    label="Title"
                    id="title"
                    name="title"
                    color="deep-purple"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Textarea
                    label="Description"
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Textarea
                    label="Content"
                    id="content"
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="Source"
                    color="deep-purple"
                    id="source"
                    name="source"
                    value={values.source}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {preview ? (
                    <div className="relative flex justify-center bg-lightPrimary">
                      <img
                        src={preview}
                        alt={preview}
                        width={100}
                        className="absolute left-0 h-full"
                      />
                      <input
                        type="file"
                        id="thumbnail"
                        name="thumbnail"
                        className="absolute h-full w-full opacity-0"
                        onChange={handleFile}
                      />
                      <button className="flex flex-col items-center">
                        <MdTrackChanges className="text-[80px] text-brand-500" />
                        <Typography variant="h5" className="text-brand-500">
                          Ganti Gambar
                        </Typography>
                        <Typography
                          variant="paragraph"
                          className="mt-2"
                          color="gray"
                        >
                          PNG, JPG and JPEG files are allowed
                        </Typography>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="relative col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6">
                        <input
                          type="file"
                          id="thumbnail"
                          name="thumbnail"
                          className="absolute h-full w-full opacity-0"
                          onChange={handleFile}
                        />
                        <button className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0">
                          <MdFileUpload className="text-[80px] text-brand-500" />
                          <Typography variant="h5" className="text-brand-500">
                            Unggah Gambar
                          </Typography>
                          <Typography
                            variant="paragraph"
                            className="mt-2"
                            color="gray"
                          >
                            PNG, JPG and JPEG files are allowed
                          </Typography>
                        </button>
                      </div>
                    </div>
                  )}
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
            onClick={() => handleEdit(props.row.original.news_id)}
          >
            Ubah
          </Button>
          <Button
            size="sm"
            variant="text"
            color="deep-purple"
            onClick={() => handleDelete(props.row.original.news_id)}
          >
            Hapus
          </Button>
        </div>
      );
    },
  },
];

const News = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(9);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState("");
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
      `http://localhost:5000/api/news?search_query=${keyword}&page=${page}&limit=${limit}`
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
    formDataToSend.append("description", values.description);
    formDataToSend.append("content", values.content);
    formDataToSend.append("thumbnail", values.thumbnail);
    formDataToSend.append("source", values.source);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/news/create",
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

      mutate("news");
      handleClose();

      setValues({
        title: "",
        description: "",
        content: "",
        thumbnail: null,
        source: "",
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

  const { handleChange, handleBlur, handleSubmit, setFieldValue, setValues } =
    useFormik({
      initialValues: {
        title: "",
        description: "",
        content: "",
        thumbnail: null,
        source: "",
      },
      onSubmit,
    });

  const { data, mutate } = useSWR(["news", keyword], fetcher);

  if (!data) return <div>Loading...</div>;

  const handleOpen = () => {
    reToken();
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
    setPreview("");
  };

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    setPreview(URL.createObjectURL(image));
    setFieldValue("thumbnail", image);
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

  const columns = columnData({ mutate });

  return (
    <div>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          <Typography variant="h4" color="gray">
            Tambah Berita
          </Typography>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-5">
              <Textarea
                label="Judul"
                id="title"
                name="title"
                maxLength={147}
                color="deep-purple"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Textarea
                label="Deskripsi"
                id="description"
                name="description"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Textarea
                label="Konten"
                id="content"
                name="content"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="Sumber"
                color="deep-purple"
                id="source"
                name="source"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {preview ? (
                <div className="relative flex justify-center bg-lightPrimary">
                  <img
                    src={preview}
                    alt={preview}
                    width={100}
                    className="absolute left-0 h-full"
                  />
                  <input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    className="absolute h-full w-full opacity-0"
                    onChange={handleFileChange}
                  />
                  <button className="flex flex-col items-center">
                    <MdTrackChanges className="text-[80px] text-brand-500" />
                    <Typography variant="h5" className="text-brand-500">
                      Ganti Gambar
                    </Typography>
                    <Typography
                      variant="paragraph"
                      className="mt-2"
                      color="gray"
                    >
                      JPG, JPEG, PNG dan WEBP
                    </Typography>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="relative col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6">
                    <input
                      type="file"
                      id="thumbnail"
                      name="thumbnail"
                      className="absolute h-full w-full opacity-0"
                      onChange={handleFileChange}
                    />
                    <button className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0">
                      <MdFileUpload className="text-[80px] text-brand-500" />
                      <Typography variant="h5" className="text-brand-500">
                        Unggah Gambar
                      </Typography>
                      <Typography
                        variant="paragraph"
                        className="mt-2"
                        color="gray"
                      >
                        JPG, JPEG, PNG dan WEBP
                      </Typography>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex mt-5 justify-end">
              <Button
                variant="text"
                color="red"
                onClick={handleOpen}
                className="mr-1"
              >
                <span>Kembali</span>
              </Button>
              <Button type="submit" variant="gradient" color="deep-purple">
                <span>Tambah</span>
              </Button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
      <NewsWidget totalRows={rows} />
      <div className="mt-4">
        <Card>
          <CardBody>
            <div className="flex justify-between">
              <div>
                <form
                  onSubmit={submitSearch}
                  className="relative flex w-[20rem]"
                >
                  <Input
                    label="Cari Berdasarkan Judul / Konten"
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
                Tambah Berita
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

export default News;
