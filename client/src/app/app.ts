import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  meteo: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getMeteo('Milano');
  }

  getMeteo(citta: string) {
    if (!citta) return;
    this.meteo = null;
    this.http.get(`http://localhost:3000/api/meteo?citta=${citta}`)
      .subscribe({
        next: (data) => this.meteo = data,
        error: () => alert("Città non trovata!")
      });
  }

  getColoreBordo() {
    if (!this.meteo) return 'border-blue-500';
    const temp = this.meteo.temperatura;
    if (temp > 25) return 'border-red-500';
    if (temp < 10) return 'border-cyan-400';
    return 'border-orange-400';
  }
}
