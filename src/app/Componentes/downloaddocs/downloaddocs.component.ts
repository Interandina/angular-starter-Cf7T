import { Component, OnInit, NgZone } from '@angular/core';
import { ServicesComponent } from 'src/app/Services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-downloaddocs',
  templateUrl: './downloaddocs.component.html',
  styleUrls: ['./downloaddocs.component.css']
})
export class DownloaddocsComponent implements OnInit {
  token:string = "";
  MostrarSpinner = false;
  msjspinner:string = "";
  constructor(private servicio: ServicesComponent)
  {
    try
    {
      this.MostrarSpinner = true;
      this.msjspinner = "Espere un momento, estamos descargando los documentos..."
      this.token = new URLSearchParams(window.location.search).get('val');
      this.servicio.DownloadPOSTWFile('hv/downloadAttachments', {"val": this.token}).then((rta: Blob) => {
        if(rta)
        {
          //console.log(rta);
          const dataType = 'application/zip';
          const blob = new Blob([rta], { type: dataType });

          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.setAttribute('download', 'documentos_anexos.zip');
          document.body.appendChild(downloadLink);
          downloadLink.click();  
        }
      }).finally(()=>{
        this.MostrarSpinner = false;
        this.msjspinner = null;
        Swal.fire({
          title: "Descarga Finalizada",
          text: "Se ha finalizado la descarga correctamente.",
          showCancelButton: false,
          cancelButtonText:'Cancelar',
          confirmButtonText: "Salir",
          confirmButtonColor: '#2780e3',
        }).then((result) => {
          if (result.isConfirmed) {
            window.close();
          } 
        });  
      });
    }
    catch(excepcion)
    {
      this.MostrarSpinner = false;
      this.msjspinner = null;
      console.log("Error de descarga");
      console.log(excepcion);
    }
  }
  ngOnInit(): void {
  }

/*
    this.servicio.SendPOSTWParamObs('hv/downloadAttachments/', {"val": this.token}, true).then((rta: any) => {
      try
      {
        if(rta == undefined)
        {
          Swal.fire("Error", "Ha ocurrido un error inesperado o no se ha encontrado el método!", 'error');
        }
        else
        {
          if(rta.success)
          {

          }
          else
            Swal.fire("Error", rta.message, "error");
        }
      }
      catch(e){
        console.log('Ha ocurrido un error inesperado. Motivo:', e);           
        throw e;
      }
    });*/
  
}
