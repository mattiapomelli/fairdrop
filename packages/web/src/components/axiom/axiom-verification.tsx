import { AxiomBuildQuery } from "@/components/axiom/axiom-build-query";
import { Spinner } from "@/components/ui/spinner";
import { useAxiomIsEligible } from "@/lib/axiom/use-axiom-is-eligible";

export function AxiomVerification() {
  const { data, isPending } = useAxiomIsEligible();

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        Checking eligibility <Spinner />
      </div>
    );
  }
  const { eligible, inputs, callback } = data || {};

  if (!eligible || !inputs || !callback) {
    return (
      <>
        <div className="text-center">You are not eligible for this airdrop :(</div>
      </>
    );
  }

  return (
    <div>
      <p>You are aligible for this airdrop!</p>
      <AxiomBuildQuery callback={callback} inputs={inputs} />
    </div>
  );
}
