import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function PreLoad() {
  useEffect(() => {
    Swal.fire({
      didOpen: () => {
          Swal.showLoading();
      },
      background: 'transparent',
      backdrop: true,
      allowOutsideClick: false,
    });
    return () => Swal.close();
  }, []);
  return <div />;
}
