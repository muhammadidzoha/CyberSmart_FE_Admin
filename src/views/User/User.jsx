import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { format } from "date-fns";
import Table from "../../components/Table/Table";
import ReactPaginate from "react-paginate";

const columnData = [
  {
    accessorKey: "",
    header: "No",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.row.index + 1}
      </Typography>
    ),
  },
  {
    accessorKey: "fullname",
    header: "Nama Lengkap",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "nik",
    header: "NIK",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {maskingNIK(props.getValue())}
      </Typography>
    ),
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "address",
    header: "Alamat Lengkap",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "village",
    header: "Dusun",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "zipcode",
    header: "Kode Pos",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "rt",
    header: "Rt",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "rw",
    header: "Rw",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "birthday",
    header: "Tangal Lahir",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {format(new Date(props.getValue()), "yyyy/MM/dd")}
      </Typography>
    ),
  },
  {
    accessorKey: "job",
    header: "Pekerjaan",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "education",
    header: "Pendidikan Terakhir",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
  },
  {
    accessorKey: "religion",
    header: "Agama",
    cell: (props) => (
      <Typography variant="small" color="gray">
        {props.getValue()}
      </Typography>
    ),
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

const User = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");

  const fetcher = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/users?search_query=${keyword}&page=${page}&limit=${limit}`
    );

    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
    return response.data;
  };

  useEffect(() => {
    mutate();
  }, [page, keyword, pages, rows]);

  const { data, mutate } = useSWR(["users", keyword], fetcher);

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

  return (
    <div>
      <Card>
        <CardBody className="overflow-x-auto">
          <div className="mt-5">
            <form
              onSubmit={submitSearch}
              className="relative flex w-full max-w-[24rem] my-5"
            >
              <Input
                label="Cari berdasarkan Nama / Alamat "
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
            <Table columnsData={columnData} tableData={data.results} />
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
                      {/* <BsArrowRightShort className="w-6 h-6" /> */}
                    </Typography>
                  }
                  previousLabel={
                    <Typography
                      variant="small"
                      color="gray"
                      className="flex items-center font-medium"
                    >
                      {/* <BsArrowLeftShort className="w-6 h-6" /> */}
                      Prev
                    </Typography>
                  }
                  nextClassName="hover:bg-gray-900/10 px-4 py-2 rounded-lg"
                  previousClassName="hover:bg-gray-900/10 px-4 py-2 rounded-lg"
                  pageCount={Math.min(10, data.totalPage)}
                  onPageChange={handlePageChange}
                  containerClassName="flex items-center space-x-2 text-navy-800 text-sm font-medium"
                  pageLinkClassName="text-navy-800 px-4 py-2 rounded-lg"
                  activeLinkClassName="bg-brand-500 text-white"
                  disabledLinkClassName="font-thin"
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default User;
