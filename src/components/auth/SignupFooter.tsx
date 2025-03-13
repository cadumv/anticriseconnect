
import React from "react";
import { Link } from "react-router-dom";
import { CardFooter } from "@/components/ui/card";

export const SignupFooter = () => {
  return (
    <CardFooter className="flex justify-center">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link 
            to="/login" 
            className="text-primary hover:underline"
          >
            Faça login
          </Link>
        </p>
      </div>
    </CardFooter>
  );
};
