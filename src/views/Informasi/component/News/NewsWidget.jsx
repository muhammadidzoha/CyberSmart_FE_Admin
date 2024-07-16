import { Card, CardBody, Typography } from "@material-tailwind/react";
import React from "react";
import { IoIosStats } from "react-icons/io";
import { HiOutlineStatusOnline, HiOutlineStatusOffline } from "react-icons/hi";
import PropTypes from "prop-types";
import axios from "axios";
import useSWR from "swr";

const NewsWidget = ({ totalRows }) => {
  const fetcher = async () => {
    const response = await axios.get(`http://localhost:5000/api/newsBelow50`);
    return response.data;
  };

  const fethcing = async () => {
    const response = await axios.get("http://localhost:5000/api/newsAbove100");
    return response.data;
  };

  const { data: below50 } = useSWR("news50", fetcher);
  const { data: above100 } = useSWR("news100", fethcing);

  if (!below50 || !above100) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-3 gap-5">
      <Card>
        <CardBody>
          <div className="flex items-center gap-5">
            <div className="bg-gray-900/10 w-12 h-12 rounded-full relative">
              <IoIosStats className="h-6 w-6 text-brand-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
            </div>
            <div>
              <Typography variant="small" color="gray">
                Total Berita
              </Typography>
              <Typography variant="h5" color="gray">
                {totalRows}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="flex items-center gap-5">
            <div className="bg-gray-900/10 w-12 h-12 rounded-full relative">
              <HiOutlineStatusOnline className="h-6 w-6 text-brand-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
            </div>
            <div>
              <Typography variant="small" color="gray">
                Berita Populer
              </Typography>
              <Typography variant="h5" color="gray">
                {above100.totalAboveNews}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="flex items-center gap-5">
            <div className="bg-gray-900/10 w-12 h-12 rounded-full relative">
              <HiOutlineStatusOffline className="h-6 w-6 text-brand-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
            </div>
            <div>
              <Typography variant="small" color="gray">
                Berita Kurang Populer
              </Typography>
              <Typography variant="h5" color="gray">
                {below50.totalNews}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

NewsWidget.propTypes = {
  totalRows: PropTypes.number,
};

export default NewsWidget;
