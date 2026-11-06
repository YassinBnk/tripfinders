import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles } from "lucide-react";
import { useStore } from "@/app/store";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/forms";
import { Img } from "@/components/ui/Img";

const loginSchema = z.object({
  email: z.email("Adresse e-mail invalide."),
  password: z.string().min(6, "6 caractères minimum."),
});
const registerSchema = loginSchema.extend({ name: z.string().trim().min(2, "Votre nom est requis.") });
type Values = z.infer<typeof registerSchema>;

const DEMO_USER = { name: "Léa Martin", email: "lea.martin@example.com" };

/** Fake auth (UI only): the user is stored in the client store. */
export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { login } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/compte";
  const isLogin = mode === "login";
  const { register, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(isLogin ? (loginSchema as unknown as typeof registerSchema) : registerSchema),
  });
  const err = formState.errors;

  const done = (name: string, email: string, demo = false) => {
    login({ name, email }, demo);
    navigate(next, { replace: true });
  };

  return (
    <div className="grid min-h-[100svh] bg-sand lg:grid-cols-2">
      <div className="hidden p-4 lg:block">
        <div className="arch h-full">
          <Img src="/images/gallery/lanternes" alt="Lanternes de cuivre dans un atelier de Marrakech" priority sizes="50vw" />
        </div>
      </div>
      <div className="flex items-center px-4 pb-16 pt-32 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <p className="eyebrow text-teal">{isLogin ? "Connexion" : "Inscription"}</p>
          <h1 className="mt-4 text-[clamp(2.4rem,5vw,3.6rem)] text-navy">
            {isLogin ? (
              <>
                Bon retour <span className="serif">parmi nous</span>
              </>
            ) : (
              <>
                Créer <span className="serif">votre compte</span>
              </>
            )}
          </h1>
          <Button variant="accent" size="lg" className="mt-8 w-full" onClick={() => done(DEMO_USER.name, DEMO_USER.email, true)}>
            <Sparkles className="size-5" aria-hidden /> Continuer avec le compte démo
          </Button>
          <p className="my-6 text-center text-sm text-muted">ou avec votre e-mail</p>
          <form noValidate onSubmit={handleSubmit((v) => done(v.name || v.email.split("@")[0]!, v.email))} className="flex flex-col gap-5">
            {!isLogin && <Field label="Nom complet" error={err.name?.message}>{(p) => <Input {...p} autoComplete="name" {...register("name")} />}</Field>}
            <Field label="E-mail" error={err.email?.message}>{(p) => <Input {...p} type="email" autoComplete="email" {...register("email")} />}</Field>
            <Field label="Mot de passe" error={err.password?.message}>{(p) => <Input {...p} type="password" autoComplete={isLogin ? "current-password" : "new-password"} {...register("password")} />}</Field>
            <Button type="submit" size="lg">
              {isLogin ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
            <Link to={`${isLogin ? "/inscription" : "/connexion"}?next=${encodeURIComponent(next)}`} className="font-medium text-teal underline">
              {isLogin ? "Créer un compte" : "Se connecter"}
            </Link>
          </p>
          <p className="mt-8 text-center text-xs text-muted">Démonstration : aucun compte n’est réellement créé.</p>
        </div>
      </div>
    </div>
  );
}

export const LoginPage = () => <AuthPage mode="login" />;
export const RegisterPage = () => <AuthPage mode="register" />;
