import { Card, CardBody, Typography } from "@material-tailwind/react";
import React from "react";
import { IoIosStats } from "react-icons/io";
import { HiOutlineStatusOnline, HiOutlineStatusOffline } from "react-icons/hi";
import PropTypes from "prop-types";
import axios from "axios";
import useSWR from "swr";

const DestinationWidget = ({ totalRows }) => {
  const fetcher = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/destinationBelow50`
    );
    return response.data;
  };

  const fethcing = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/destinationAbove100"
    );
    return response.data;
  };

  const { data: below50 } = useSWR("destinations50", fetcher);
  const { data: above100 } = useSWR("destinations100", fethcing);

  // Pastikan bahwa data yang diambil tidak null sebelum digunakan
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
                Total Destinasi
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
                Destinasi Populer
              </Typography>
              <Typography variant="h5" color="gray">
                {above100.totalAboveDestination}
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
                Destinasi Kurang Populer
              </Typography>
              <Typography variant="h5" color="gray">
                {below50.totalDestination}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

DestinationWidget.propTypes = {
  totalRows: PropTypes.number,
};

export default DestinationWidget;
