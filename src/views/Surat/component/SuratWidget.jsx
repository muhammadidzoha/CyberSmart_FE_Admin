import { Card, CardBody, Typography } from "@material-tailwind/react";
import axios from "axios";
import React from "react";
import { TbMailPause, TbMailForward, TbMailOff, TbMail } from "react-icons/tb";
import useSWR from "swr";
import PropTypes from "prop-types";

const SuratWidget = ({ totalRows }) => {
  const incoming = async () => {
    const response = await axios.get(`http://localhost:5000/api/letterPending`);
    return response.data;
  };

  const outgoing = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/letterAccepted"
    );
    return response.data;
  };

  const rejected = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/letterRejected"
    );
    return response.data;
  };

  const { data: incomingLetter } = useSWR("incoming", incoming);
  const { data: outgoingLetter } = useSWR("outgoing", outgoing);
  const { data: rejectedLetter } = useSWR("rejected", rejected);

  if (!incomingLetter || !outgoingLetter || !rejectedLetter)
    return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-5">
      <Card>
        <CardBody>
          <div className="flex items-center gap-5">
            <div className="bg-gray-900/10 w-12 h-12 rounded-full relative">
              <TbMailPause className="h-6 w-6 text-brand-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
            </div>
            <div>
              <Typography variant="small" color="gray">
                Surat Masuk
              </Typography>
              <Typography variant="h5" color="gray">
                {incomingLetter.incomingLetter}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="flex items-center gap-5">
            <div className="bg-gray-900/10 w-12 h-12 rounded-full relative">
              <TbMailForward className="h-6 w-6 text-brand-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
            </div>
            <div>
              <Typography variant="small" color="gray">
                Surat Keluar
              </Typography>
              <Typography variant="h5" color="gray">
                {outgoingLetter.outgoingLetter}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="flex items-center gap-5">
            <div className="bg-gray-900/10 w-12 h-12 rounded-full relative">
              <TbMailOff className="h-6 w-6 text-brand-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
            </div>
            <div>
              <Typography variant="small" color="gray">
                Surat Ditolak
              </Typography>
              <Typography variant="h5" color="gray">
                {rejectedLetter.rejectedLetter}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="flex items-center gap-5">
            <div className="bg-gray-900/10 w-12 h-12 rounded-full relative">
              <TbMail className="h-6 w-6 text-brand-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
            </div>
            <div>
              <Typography variant="small" color="gray">
                Total Surat
              </Typography>
              <Typography variant="h5" color="gray">
                {totalRows}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

SuratWidget.propTypes = {
  totalRows: PropTypes.number,
};

export default SuratWidget;
