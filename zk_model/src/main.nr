use noir_ml::layers::{fc};
use noir_ml::activations::{relu};
use noir_ml::utils::{arg_max};

fn main(
    pub model: [Field; 401],
    input: [Field; 38],
    pub result: Field
) {
    assert(prediction(model, input) == result);
}

fn prediction(input) {

}

#[test]
fn test_main() {
    main(1, 2);

    // Uncomment to make test fail
    // main(1, 1);
}
