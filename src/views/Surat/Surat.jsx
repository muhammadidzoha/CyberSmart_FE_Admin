import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import Table from "../../components/Table/Table";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import SuratWidget from "./component/SuratWidget";
import useSWR from "swr";

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
    accessorKey: "author.fullname",
    header: "NAMA",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "author.nik",
    header: "NIK",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {maskingNIK(props.getValue())}
      </Typography>
    ),
  },
  {
    accessorKey: "author.address",
    header: "ALAMAT",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "letter_type",
    header: "TUJUAN SURAT",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "",
    header: "Aksi",
    cell: (props) => {
      const [open, setOpen] = useState(false);
      const [openBerkas, setOpenBerkas] = useState(false);

      const [data, setData] = useState();

      const handleOpenDialog = async (request_id) => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/letter/${request_id}`
          );
          setData(response.data);
          setOpenBerkas(!openBerkas);
        } catch (error) {
          handleClose();
        }
      };

      const handleOpen = () => {
        setOpen(!open);
      };

      const handleClose = () => {
        setOpen(false);
        setOpenBerkas(false);
      };

      const handleDelete = async (request_id) => {
        try {
          const response = await axios.delete(
            `http://localhost:5000/api/letter/delete/${request_id}`
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

          mutate("letters");
        } catch (error) {
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

      const onSubmit = async (values) => {
        const formDataToSend = new FormData();
        formDataToSend.append("status", values.status);
        formDataToSend.append("pdf_file", values.pdf_file);
        try {
          const response = await axios.patch(
            `http://localhost:5000/api/letter/update/${currentRequestId}`,
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

          mutate("letters");
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

      const [currentRequestId, setCurrentRequestId] = useState(null);

      const { values, handleBlur, handleSubmit, setValues, setFieldValue } =
        useFormik({
          initialValues: {
            status: "",
            pdf_file: null,
          },
          onSubmit,
        });

      const handleFile = (e) => {
        const image = e.target.files[0];
        setFieldValue("pdf_file", image);
      };

      const handleEdit = async (request_id) => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/letter/${request_id}`
          );
          const lettersData = response.data;

          console.log(lettersData);

          setValues({
            status: lettersData.status,
          });

          setCurrentRequestId(request_id);

          handleOpen();
        } catch (error) {
          console.error("Error fetching destination data:", error);
        }
      };

      return (
        <div className="flex justify-center">
          <Dialog open={open} handler={handleOpen}>
            <DialogHeader>
              <Typography variant="h4" color="gray">
                Edit Surat
              </Typography>
            </DialogHeader>
            <DialogBody>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-5">
                  <Select
                    label="Status"
                    color="deep-purple"
                    name="status"
                    value={values.status}
                    id="status"
                    onChange={(selected) => setFieldValue("status", selected)} // Perubahan di sini
                    onBlur={handleBlur}
                  >
                    <Option value="pending">Pending</Option>
                    <Option value="acc">Di Acc</Option>
                  </Select>
                  <div className="flex flex-col">
                    <label htmlFor="pdf_file">Template Surat: </label>
                    <input
                      type="file"
                      name="pdf_file"
                      id="pdf_file"
                      onChange={handleFile}
                      onBlur={handleBlur}
                      className="border border-gray-400 rounded-md p-1"
                    />
                  </div>
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
          <Dialog
            open={openBerkas}
            handler={handleOpenDialog}
            className="bg-transparent shadow-none"
          >
            <Card className="overflow-scroll overflow-x-hidden max-h-[600px]">
              <CardBody>
                <div>
                  {data?.urlToPdfFile ? (
                    <>
                      <Typography>Surat Pengajuan:</Typography>
                      <iframe
                        src={data?.urlToPdfFile}
                        title={data?.letter_type}
                        height={700}
                        className="w-full min-h-0"
                      ></iframe>
                    </>
                  ) : null}
                </div>
                <div className="mt-5">
                  {data?.urlPengantar ? (
                    <>
                      <Typography>Surat Pengantar:</Typography>
                      <img src={data?.urlPengantar} alt="" />
                    </>
                  ) : null}
                </div>
                <div className="mt-5">
                  {data?.urlKK ? (
                    <>
                      <Typography>Kartu Keluarga:</Typography>
                      <img src={data?.urlKK} alt="" />
                    </>
                  ) : null}
                </div>
                <div className="mt-5">
                  {data?.urlAkte ? (
                    <>
                      <Typography>Akte Kelahiran: </Typography>
                      <img src={data?.urlAkte} alt="" />
                    </>
                  ) : null}
                </div>
                <div className="mt-5">
                  {data?.urlSuratKelahiran ? (
                    <>
                      <Typography>Surat Kelahiran: </Typography>
                      <img src={data?.urlSuratKelahiran} alt="" />
                    </>
                  ) : null}
                </div>
                <div className="mt-5">
                  {data?.urlSuratKematian ? (
                    <>
                      <Typography>Surat Kematian: </Typography>
                      <img src={data?.urlSuratKematian} alt="" />
                    </>
                  ) : null}
                </div>
                <div className="mt-5">
                  {data?.urlKTPAyah ? (
                    <>
                      <Typography>KTP Ayah: </Typography>
                      <img src={data?.urlKTPAyah} alt="" />
                    </>
                  ) : null}
                </div>
                <div className="mt-5">
                  {data?.urlKTPIbu ? (
                    <>
                      <Typography>KTP Ibu: </Typography>
                      <img src={data?.urlKTPIbu} alt="" />
                    </>
                  ) : null}
                </div>
                <div className="mt-5">
                  {data?.urlKTPMeninggal ? (
                    <>
                      <Typography>KTP Yang Meninggal: </Typography>
                      <img src={data?.urlKTPMeninggal} alt="" />
                    </>
                  ) : null}
                </div>
                <div className="mt-5">
                  {data?.urlKTPPemohon ? (
                    <>
                      <Typography>KTP Pemohon: </Typography>
                      <img src={data?.urlKTPPemohon} alt="" />
                    </>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </Dialog>
          <Button
            onClick={() => handleOpenDialog(props.row.original.request_id)}
            size="sm"
            variant="text"
            color="deep-purple"
          >
            Lihat Berkas
          </Button>
          <Button
            size="sm"
            variant="text"
            color="deep-purple"
            onClick={() => handleEdit(props.row.original.request_id)}
          >
            Ubah
          </Button>
          <Button
            size="sm"
            variant="text"
            color="deep-purple"
            onClick={() => handleDelete(props.row.original.request_id)}
          >
            Hapus
          </Button>
        </div>
      );
    },
  },
];

const maskingNIK = (nik) => {
  if (typeof nik === "number") {
    // Konversi angka menjadi string
    const nikString = nik.toString();

    // Sembunyikan semua karakter kecuali empat karakter terakhir
    const nikTersamarkan = "************" + nikString.slice(-4);

    return nikTersamarkan;
  }

  return nik;
};

const Surat = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(9);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");

  const fetcher = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/letters?search_query=${keyword}&page=${page}&limit=${limit}`
    );
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    return response.data;
  };

  useEffect(() => {
    mutate();
  }, [page, keyword, pages, rows]);

  const { data, mutate } = useSWR(["letters", keyword], fetcher);

  if (!data) return <div>Loading...</div>;

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
      <SuratWidget totalRows={rows} />
      <div className="mt-4">
        <Card>
          <CardBody>
            <div className="flex justify-between">
              <div>
                <form
                  onSubmit={submitSearch}
                  className="relative flex w-[24rem]"
                >
                  <Input
                    label="Cari berdasarkan Nama Lengkap / Alamat"
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
            </div>
            <div className="mt-5">
              <Table columnsData={columns} tableData={data.results} />
              <div className="my-5 flex justify-between">
                <Typography variant="small" color="gray">
                  Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
                </Typography>
                <div key={{}}>
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

export default Surat;
