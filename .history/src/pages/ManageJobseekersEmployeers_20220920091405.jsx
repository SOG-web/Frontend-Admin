import { useState, useEffect } from 'react';
import useAxios from '../hooks/useAxios';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorIndicator } from '../components/ErrorIndicator';
import { ManageJobseekersEmployeersTable } from './ManageJobseekersEmployeersTable';

export const ManageJobseekersEmployeers = ({ title }) => {
  const [tableData, setTableData] = useState(null);
  const [refetch, setRefetch] = useState(0);
  const getData = useAxios();
  const {
    makeRequest,
    isLoading,
    errorMessage,
    success,
    data: gottenData,
  } = getData();

  useEffect(() => {
    makeRequest({
      url:
        title === 'Manage Jobseekers'
          ? '/jobseekers/user-document-review/'
          : '/employer/user-profile-review/',
    });
  }, [refetch]);

  useEffect(() => {
    if (success) {
      const newData = gottenData?.results?.map((data, index) => {
        // console.log(data.user.email);
        return {
          id: data.id,
          name: data.user.first_name | '',
          email: data.user.email | '',
          number: data.phone_number | '',
          actions: '',
          userId: data.user.id,
        };
      });

      setTableData(newData);
    }
  }, [success]);

  if (isLoading) return <LoadingIndicator />;
  if (errorMessage) return <ErrorIndicator error={errorMessage} />;

  // gottenData && console.log(gottenData);
  // return <p>hello</p>;

  // console.log(gottenData);

  return tableData !== null ? (
    <>
      {console.log(tableData)}
      <ManageJobseekersEmployeersTable
        tableData={tableData}
        title={title}
        setRefetch={setRefetch}
      />
    </>
  ) : (
    <ErrorIndicator error='No Data' />
  );
};