import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-diagnostico-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './diagnostico-form.component.html',
  styleUrl: './diagnostico-form.component.css',
})
export class DiagnosticoFormComponent implements OnInit {
  readonly saving = input<boolean>(false);
  readonly initialValue = input<string | null>(null);
  readonly submitted = output<string>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();
  readonly form = this.fb.nonNullable.group({
    diagnostico: ['', Validators.required],
  });

  ngOnInit(): void {
    const v = this.initialValue();
    if (v) this.form.controls.diagnostico.setValue(v);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitted.emit(this.form.getRawValue().diagnostico.trim());
  }
}
