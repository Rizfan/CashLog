<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApiResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    //define properti
    public $error;
    public $status;
    public $message;
    public $resource;

    public function __construct($error, $status, $message, $resource)
    {
        parent::__construct($resource);
        $this->error = $error;
        $this->status = $status;
        $this->message = $message;
    }

    public function toArray(Request $request): array
    {
        return [
            'error' => $this->error,
            'status' => $this->status,
            'message' => $this->message,
            'data' => $this->resource,
        ];
    }
}
